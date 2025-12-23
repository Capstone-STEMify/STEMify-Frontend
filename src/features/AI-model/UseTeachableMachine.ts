import { useState, useCallback } from 'react'
import * as tf from '@tensorflow/tfjs'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export interface PredictionResult {
  className: string
  probability: number
}

export interface TrainingStatus {
  message: string
  type: 'info' | 'success' | 'error'
}

interface TeachableMachineModel {
  featureExtractor: tf.LayersModel | tf.GraphModel
  classifier: tf.LayersModel
  predict: (input: tf.Tensor) => Promise<PredictionResult[]>
  getTopKClasses: (input: tf.Tensor, k?: number) => Promise<PredictionResult[]>
  getClassConfidence: (input: tf.Tensor, className: string) => Promise<number>
}

const CONFIG = {
  imageSize: 224,
  minImagesPerClass: 5,
  epochs: 50,
  batchSizeMax: 2,
  validationSplit: 0.3,
  learningRate: 0.001,
  dropout1: 0.5,
  dropout2: 0.3,
  debugLogs: true
}

const BASE_MODEL_URL =
  'https://zlumjdsauobocldzvjoo.supabase.co/storage/v1/object/public/ai-models/MobileNetV3/model.json'

export function useTeachableMachine(initialClasses: string[] = ['Class 1', 'Class 2']) {
  const [classes, setClasses] = useState<string[]>(initialClasses)
  const [classImages, setClassImages] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {}
    initialClasses.forEach((className) => {
      initial[className] = []
    })
    return initial
  })
  const [model, setModel] = useState<TeachableMachineModel | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null)
  const [predictionResults, setPredictionResults] = useState<PredictionResult[] | null>(null)

  // Add new class
  const addNewClass = useCallback(
    (newClassName: string) => {
      if (newClassName && !classes.includes(newClassName)) {
        setClasses((prev) => [...prev, newClassName])
        setClassImages((prev) => ({ ...prev, [newClassName]: [] }))
      }
    },
    [classes]
  )

  // Rename class
  const renameClass = useCallback((oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) return

    setClasses((prev) => prev.map((c) => (c === oldName ? newName : c)))

    setClassImages((prev) => {
      const newImages = { ...prev }
      if (prev[oldName]) {
        newImages[newName] = prev[oldName]
        delete newImages[oldName]
      }
      return newImages
    })
  }, [])

  // Remove class
  const removeClass = useCallback((className: string) => {
    setClasses((prev) => prev.filter((c) => c !== className))
    setClassImages((prev) => {
      const newImages = { ...prev }
      delete newImages[className]
      return newImages
    })
  }, [])

  // Update image preview
  const updateImagePreview = useCallback((className: string, imageDataUrl: string) => {
    setClassImages((prev) => ({
      ...prev,
      [className]: [...(prev[className] || []), imageDataUrl]
    }))
  }, [])

  // Remove image
  const removeImage = useCallback((className: string, index: number) => {
    setClassImages((prev) => ({
      ...prev,
      [className]: prev[className].filter((_, i) => i !== index)
    }))
  }, [])

  // Prepare training data
  const prepareTrainingData = useCallback(async () => {
    console.log('Preparing training data...')

    const allImages: tf.Tensor[] = []
    const allLabels: number[] = []

    for (let classIndex = 0; classIndex < classes.length; classIndex++) {
      const className = classes[classIndex]
      const images = classImages[className]

      console.log(`Processing class ${className}: ${images.length} images`)

      for (const imageSrc of images) {
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'

          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = imageSrc
          })

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Could not get canvas context')

          canvas.width = CONFIG.imageSize
          canvas.height = CONFIG.imageSize
          ctx.drawImage(img, 0, 0, CONFIG.imageSize, CONFIG.imageSize)

          const tensor = tf.browser.fromPixels(canvas)
          const normalized = tensor.div(255.0)

          allImages.push(normalized)
          allLabels.push(classIndex)

          tensor.dispose()
          await tf.nextFrame()
        } catch (error) {
          console.error(`Error processing image for class ${className}:`, error)
        }
      }
    }

    if (allImages.length === 0) {
      throw new Error('Không có ảnh hợp lệ để train!')
    }

    const imagesTensor = tf.stack(allImages)
    const labelsTensor = tf.oneHot(tf.tensor1d(allLabels, 'int32'), classes.length)

    allImages.forEach((tensor) => tensor.dispose())

    console.log('Training data prepared:', imagesTensor.shape, labelsTensor.shape)
    return { images: imagesTensor, labels: labelsTensor }
  }, [classes, classImages])

  // Create transfer learning model
  const createTransferLearningModel = useCallback(async (numClasses: number) => {
    console.log('Creating transfer learning model...')

    let baseModel: tf.LayersModel | null = null
    let graphModel: tf.GraphModel | null = null

    // Try load as GraphModel first (MobileNet v3 from Supabase is a graph model)
    try {
      if (BASE_MODEL_URL.includes('supabase.co')) {
        graphModel = await tf.loadGraphModel(BASE_MODEL_URL)
        console.log('GraphModel loaded successfully')
      } else {
        baseModel = await tf.loadLayersModel(BASE_MODEL_URL)
      }
    } catch (err) {
      console.warn('Failed to load as GraphModel, try LayersModel', err)
      baseModel = await tf.loadLayersModel(BASE_MODEL_URL)
    }

    if (!baseModel && !graphModel) {
      throw new Error('Không thể load base model')
    }

    let featureExtractor: tf.LayersModel | tf.GraphModel
    let featureSize: number

    if (graphModel) {
      featureExtractor = graphModel
      const testInput = tf.zeros([1, CONFIG.imageSize, CONFIG.imageSize, 3])
      const testOutput = featureExtractor.predict(testInput) as tf.Tensor
      console.log('GraphModel output shape:', testOutput.shape)
      featureSize = testOutput.shape.slice(1).reduce((a, b) => a * b, 1)
      console.log('Feature size:', featureSize)
      testInput.dispose()
      testOutput.dispose()
    } else {
      // LayersModel path
      featureExtractor = baseModel!
      for (let i = baseModel!.layers.length - 1; i >= 0; i--) {
        const layer = baseModel!.layers[i]
        console.log(`Layer ${i}: ${layer.name}, output shape:`, layer.outputShape)

        if (
          layer.name.includes('global_average_pooling') ||
          layer.name.includes('avg_pool') ||
          (layer.name.includes('dense') && i < baseModel!.layers.length - 1)
        ) {
          featureExtractor = tf.model({
            inputs: baseModel!.inputs,
            outputs: layer.output
          })
          console.log('Feature extractor created from layer:', layer.name)
          break
        }
      }

      if (featureExtractor === baseModel) {
        featureExtractor = tf.model({
          inputs: baseModel!.inputs,
          outputs: baseModel!.layers[baseModel!.layers.length - 2].output
        })
        console.log('Using fallback feature extractor')
      }

      const testInput = tf.zeros([1, CONFIG.imageSize, CONFIG.imageSize, 3])
      const testOutput = featureExtractor.predict(testInput) as tf.Tensor
      console.log('Feature extractor output shape:', testOutput.shape)

      featureSize = testOutput.shape.slice(1).reduce((a, b) => a * b, 1)
      console.log('Feature size:', featureSize)

      testInput.dispose()
      testOutput.dispose()
    }

    const classifier = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [featureSize],
          units: 32,
          activation: 'relu',
          name: 'dense1'
        }),
        tf.layers.dropout({ rate: CONFIG.dropout1 }),
        tf.layers.dense({
          units: 16,
          activation: 'relu',
          name: 'dense2'
        }),
        tf.layers.dropout({ rate: CONFIG.dropout2 }),
        tf.layers.dense({
          units: numClasses,
          activation: 'softmax',
          name: 'predictions'
        })
      ]
    })

    classifier.compile({
      optimizer: tf.train.adam(CONFIG.learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    })

    console.log('Transfer learning model created with input shape:', [featureSize])
    return { featureExtractor, classifier }
  }, [])

  // Train model
  const trainModel = useCallback(async () => {
    if (isTraining) return

    const totalImages = Object.values(classImages).reduce((sum, images) => sum + images.length, 0)
    const minImagesPerClass = CONFIG.minImagesPerClass

    if (totalImages < minImagesPerClass * classes.length) {
      alert(
        `Cần ít nhất ${minImagesPerClass} ảnh cho mỗi class để train model tốt!\nHiện tại: ${totalImages} ảnh\nCần: ${minImagesPerClass * classes.length} ảnh`
      )
      return
    }

    let balanced = true
    classes.forEach((className) => {
      if (classImages[className].length < minImagesPerClass) {
        balanced = false
      }
    })

    if (!balanced) {
      alert(`Dữ liệu không cân bằng! Cần ít nhất ${minImagesPerClass} ảnh cho mỗi class.`)
      return
    }

    setIsTraining(true)

    try {
      console.log('Bắt đầu train model thật...')
      setTrainingStatus({ message: 'Đang chuẩn bị dữ liệu...', type: 'info' })
      setTrainingProgress(10)

      const { images, labels } = await prepareTrainingData()
      console.log('Training data prepared:', images.shape, labels.shape)

      setTrainingStatus({ message: 'Đang tạo model...', type: 'info' })
      setTrainingProgress(20)

      const { featureExtractor, classifier } = await createTransferLearningModel(classes.length)
      console.log('Model created:', classifier)

      setTrainingStatus({ message: 'Đang train model...', type: 'info' })
      setTrainingProgress(30)

      console.log('Extracting features...')
      const FEATURE_BATCH_SIZE = 32
      const numSamples = images.shape[0]
      let features: tf.Tensor

      try {
        const batchFeaturesArray: tf.Tensor[] = []

        for (let i = 0; i < numSamples; i += FEATURE_BATCH_SIZE) {
          const end = Math.min(i + FEATURE_BATCH_SIZE, numSamples)

          const batchResult = tf.tidy(() => {
            const batchImages = images.slice([i, 0, 0, 0], [end - i, -1, -1, -1])
            return featureExtractor.predict(batchImages) as tf.Tensor
          })

          batchFeaturesArray.push(batchResult)

          await tf.nextFrame()
        }

        features = tf.concat(batchFeaturesArray, 0)

        batchFeaturesArray.forEach((t) => t.dispose())
      } catch (err) {
        throw new Error('Lỗi khi trích xuất đặc trưng (Feature Extraction): ' + err)
      }

      console.log('Features shape:', features.shape)

      const batchSize = features.shape[0]
      const featureSize = features.shape.slice(1).reduce((a, b) => a * b, 1)
      const processedFeatures = features.reshape([batchSize, featureSize])
      console.log('Reshaped features shape:', processedFeatures.shape)

      console.log('Training classification head...')
      await classifier.fit(processedFeatures, labels, {
        epochs: CONFIG.epochs,
        batchSize: Math.min(CONFIG.batchSizeMax, processedFeatures.shape[0]),
        validationSplit: CONFIG.validationSplit,
        shuffle: true,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            const trainLoss = logs?.loss ?? 0
            const trainAcc = (logs as any)?.acc ?? logs?.accuracy ?? 0
            const valLoss = (logs as any)?.val_loss ?? 0
            const valAcc = (logs as any)?.val_acc ?? (logs as any)?.val_accuracy ?? 0

            console.log(
              `Epoch ${epoch + 1}: loss=${trainLoss.toFixed(4)}, acc=${trainAcc.toFixed(4)}, val_loss=${valLoss.toFixed(
                4
              )}, val_acc=${valAcc.toFixed(4)}`
            )
            const progress = 30 + (epoch + 1) * (60 / CONFIG.epochs)
            setTrainingProgress(progress)
            setTrainingStatus({
              message: `Epoch ${epoch + 1}/${CONFIG.epochs}: Train acc ${(trainAcc * 100).toFixed(
                1
              )}%, Val acc ${(valAcc * 100).toFixed(1)}%, Loss ${trainLoss.toFixed(4)}, Val loss ${valLoss.toFixed(4)}`,
              type: 'info'
            })
            await tf.nextFrame()
          }
        }
      })

      const finalModel: TeachableMachineModel = {
        featureExtractor,
        classifier,
        predict: async function (input: tf.Tensor) {
          const probs = tf.tidy(() => {
            const features = this.featureExtractor.predict(input) as tf.Tensor
            const batchSize = features.shape[0]
            const featureSize = features.shape.slice(1).reduce((a, b) => a * b, 1)
            const processedFeatures = features.reshape([batchSize, featureSize])
            const predictions = this.classifier.predict(processedFeatures) as tf.Tensor
            return Array.from(predictions.dataSync())
          })

          const results: PredictionResult[] = []
          classes.forEach((className, index) => {
            results.push({
              className,
              probability: probs[index]
            })
          })

          return results
        },
        getTopKClasses: async function (input: tf.Tensor, k = 3) {
          const results = await this.predict(input)
          return results.slice(0, k)
        },
        getClassConfidence: async function (input: tf.Tensor, className: string) {
          const results = await this.predict(input)
          const result = results.find((r) => r.className === className)
          return result ? result.probability : 0
        }
      }

      setModel(finalModel)

      features.dispose()
      processedFeatures.dispose()
      images.dispose()
      labels.dispose()

      setTrainingStatus({ message: 'Model đã được train thành công!', type: 'success' })
      setTrainingProgress(100)
    } catch (error) {
      console.error('Lỗi khi train model:', error)
      setTrainingStatus({
        message: `Lỗi khi train model: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      })
    } finally {
      setIsTraining(false)
    }
  }, [isTraining, classes, classImages, prepareTrainingData, createTransferLearningModel])

  // Download model
  const downloadModel = useCallback(async () => {
    if (!model) {
      alert('Chưa có model để tải xuống! Hãy train model trước.')
      return
    }

    try {
      setTrainingStatus({ message: 'Đang chuẩn bị tải xuống model...', type: 'info' })

      // --- Lưu model vào bộ nhớ (thay vì auto download) ---
      const artifacts = await model.classifier.save(
        tf.io.withSaveHandler(async (a): Promise<tf.io.SaveResult> => {
          return {
            modelArtifactsInfo: {
              dateSaved: new Date(),
              modelTopologyType: 'JSON'
            },
            responses: [],
            errors: []
          }
        })
      )

      // artifacts ở đây là SaveResult -> model data được TensorFlow lưu sẵn vào classifer.modelArtifacts
      const handler = await model.classifier.save(
        tf.io.withSaveHandler(async (artifacts): Promise<tf.io.SaveResult> => {
          const zip = new JSZip()

          // Lưu model.json
          zip.file('model.json', JSON.stringify(artifacts.modelTopology, null, 2))

          // Lưu weight file
          if (artifacts.weightData) {
            zip.file('trained-classifier.weights.bin', artifacts.weightData)
          }

          // Thêm metadata
          const modelInfo = {
            classes,
            modelType: 'image_classification',
            architecture: 'MobileNet_v1_0.25_224_Transfer_Learning',
            inputShape: [CONFIG.imageSize, CONFIG.imageSize, 3],
            outputClasses: classes.length,
            baseModel: BASE_MODEL_URL,
            trainingDate: new Date().toISOString(),
            description: 'Model được train bằng Teachable Machine',
            usage: {
              loadBaseModel: 'Load MobileNet từ URL trên',
              loadClassifier: 'Load trained-classifier từ file đã tải',
              preprocessing: 'Resize image to 224x224, normalize /255.0'
            }
          }
          zip.file('model-info.json', JSON.stringify(modelInfo, null, 2))

          // Thêm labels
          const labelsInfo = {
            labels: classes,
            description: 'Class labels for the trained model'
          }
          zip.file('labels.json', JSON.stringify(labelsInfo, null, 2))

          // Tạo ZIP
          const zipBlob = await zip.generateAsync({ type: 'blob' })
          saveAs(zipBlob, 'trained-classifier.zip')

          // Return kết quả hợp lệ cho TensorFlow
          return {
            modelArtifactsInfo: {
              dateSaved: new Date(),
              modelTopologyType: 'JSON'
            },
            responses: [],
            errors: []
          }
        })
      )

      setTrainingStatus({
        message:
          'Model đã được tải xuống thành công! Bao gồm: model.json, weights.bin, model-info.json, labels.json (ZIP).',
        type: 'success'
      })
    } catch (error) {
      console.error('Lỗi khi tải xuống model:', error)
      setTrainingStatus({
        message: `❌ Lỗi khi tải xuống model: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      })
    }
  }, [model, classes])

  // Helper function to download files
  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Analyze image
  const analyzeImage = useCallback(
    async (imageSrc: string) => {
      if (!model) {
        alert('Chưa có model để phân tích! Hãy train model trước.')
        return
      }

      console.log('Bắt đầu phân tích ảnh...')
      setTrainingStatus({ message: 'Đang phân tích ảnh...', type: 'info' })

      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = imageSrc
        })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get canvas context')

        canvas.width = CONFIG.imageSize
        canvas.height = CONFIG.imageSize
        ctx.drawImage(img, 0, 0, CONFIG.imageSize, CONFIG.imageSize)

        const tensor = tf.browser.fromPixels(canvas)
        const normalized = tensor.div(255.0)
        const batched = normalized.expandDims(0)

        console.log('Image tensor shape:', batched.shape)

        const results = await model.predict(batched)
        console.log('Final results:', results)

        setPredictionResults(results)

        const topResult = results[0]
        setTrainingStatus({
          message: `Dự đoán: ${topResult.className} (${(topResult.probability * 100).toFixed(1)}%)`,
          type: 'success'
        })

        tensor.dispose()
        normalized.dispose()
        batched.dispose()
      } catch (error) {
        console.error('Error analyzing image:', error)
        setTrainingStatus({
          message: `Lỗi khi phân tích ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'error'
        })
      }
    },
    [model]
  )

  return {
    classes,
    classImages,
    model,
    isTraining,
    trainingProgress,
    trainingStatus,
    predictionResults,
    addNewClass,
    renameClass,
    removeClass,
    updateImagePreview,
    removeImage,
    trainModel,
    downloadModel,
    analyzeImage
  }
}
