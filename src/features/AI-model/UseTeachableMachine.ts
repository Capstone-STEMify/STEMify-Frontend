import { useState, useCallback } from 'react'
import * as tf from '@tensorflow/tfjs'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useTranslations } from 'next-intl'

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
  epochs: 10,
  batchSizeMax: 16,
  validationSplit: 0.3,
  learningRate: 0.001,
  dropout1: 0.5,
  dropout2: 0.3,
  debugLogs: true,
  earlyStoppingPatience: 5, 
  minDelta: 0.001 
}


const MOBILENET_CONFIG = { version: 1 as const, alpha: 1.0 as const }

export function useTeachableMachine(initialClasses: string[] = ['Class 1', 'Class 2']) {
  const t = useTranslations('agent.modelMaker.microbit.status')
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
  const [loadedModelInfo, setLoadedModelInfo] = useState<{ version: string; url: string; type: string } | null>(null)

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
    console.log(`Loading MobileNet v${MOBILENET_CONFIG.version} alpha ${MOBILENET_CONFIG.alpha}...`)

    let baseModel: tf.LayersModel | null = null
    let graphModel: tf.GraphModel | null = null
    let isGraphModel = false
    let actualModelVersion = MOBILENET_CONFIG.version.toString()
    let actualModelUrl = ''
    
    const modelConfigs = [
      {
        url: 'https://zlumjdsauobocldzvjoo.supabase.co/storage/v1/object/public/ai-models/MobileNetV3/model.json',
        type: 'graph' as const,
        version: 'v3'
      },
      // MobileNet v1 URLs
      {
        url: 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json',
        type: 'layers' as const,
        version: 'v1'
      },
      {
        url: 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.75_224/model.json',
        type: 'layers' as const,
        version: 'v1'
      },
      {
        url: 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.5_224/model.json',
        type: 'layers' as const,
        version: 'v1'
      },
      {
        url: 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json',
        type: 'layers' as const,
        version: 'v1'
      }
    ]
    
    let lastError: Error | null = null
    let loadedModelInfo: { url: string; version: string; type: string } | null = null
    
    for (const modelInfo of modelConfigs) {
      try {
        console.log(`Trying to load MobileNet ${modelInfo.version} from: ${modelInfo.url}`)
        
        if (modelInfo.type === 'graph') {
          // Load as GraphModel (MobileNet v3)
          graphModel = await tf.loadGraphModel(modelInfo.url)
          
          if (!graphModel) {
            throw new Error('GraphModel không được load thành công')
          }
          
          console.log(`✓ MobileNet ${modelInfo.version} GraphModel loaded successfully`)
          console.log('GraphModel inputs:', graphModel.inputs)
          console.log('GraphModel outputs:', graphModel.outputs)
          
          isGraphModel = true
          actualModelVersion = modelInfo.version
          actualModelUrl = modelInfo.url
          loadedModelInfo = { url: modelInfo.url, version: modelInfo.version, type: 'graph' }
          break
        } else {
          // Load as LayersModel (MobileNet v1 - fallback)
          baseModel = await tf.loadLayersModel(modelInfo.url)
          
          if (!baseModel || !baseModel.layers) {
            throw new Error('Base model không có layers property')
          }
          
          actualModelVersion = modelInfo.version
          actualModelUrl = modelInfo.url
          loadedModelInfo = { url: modelInfo.url, version: modelInfo.version, type: 'layers' }
          console.log(`✓ MobileNet ${modelInfo.version} LayersModel loaded successfully`)
          console.log('Base model layers:', baseModel.layers.length)
          break
        }
      } catch (error) {
        console.warn(`✗ Failed to load ${modelInfo.version} from ${modelInfo.url}:`, error)
        lastError = error instanceof Error ? error : new Error(String(error))
        continue
      }
    }
    
    if (!baseModel && !graphModel) {
      throw new Error(
        `Không thể tải MobileNet model từ bất kỳ URL nào. ` +
        `Đã thử ${modelConfigs.length} URLs khác nhau. ` +
        `Lỗi cuối cùng: ${lastError?.message || 'Unknown error'}. ` +
        `Vui lòng kiểm tra kết nối internet.`
      )
    }
    
    if (loadedModelInfo) {
      console.log(`✓ Successfully loaded MobileNet ${loadedModelInfo.version} (${loadedModelInfo.type} model)`)
      // Store model info for later use in metadata
      // Note: This is a workaround since we can't easily pass this through the callback
    }

    let featureExtractor: tf.LayersModel | tf.GraphModel
    let featureSize: number = 0
    
    if (isGraphModel && graphModel) {
      // Handle GraphModel (MobileNet v3)
      // GraphModel outputs classification directly [batch, 1001]
      // For transfer learning, we'll use the full model as feature extractor
      // and add our classifier on top
      console.log('Using GraphModel as feature extractor (MobileNet v3)')
      featureExtractor = graphModel
      
      // Test to get output shape
      const testInput = tf.zeros([1, CONFIG.imageSize, CONFIG.imageSize, 3])
      const testOutput = featureExtractor.predict(testInput) as tf.Tensor
      console.log('GraphModel output shape:', testOutput.shape)
      
      // MobileNet v3 outputs [batch, 1001] - we'll use this as features
      // For transfer learning, we can use the logits (before softmax) or the full output
      if (!testOutput.shape || testOutput.shape.length < 2) {
        throw new Error('GraphModel output shape không hợp lệ')
      }
      featureSize = testOutput.shape[1] || 1001 // Default to 1001 if undefined
      console.log('Feature size from GraphModel:', featureSize)
      
      testInput.dispose()
      testOutput.dispose()
    } else if (baseModel) {
      // Handle LayersModel (MobileNet v1 - fallback)
      console.log('Processing LayersModel for feature extraction...')
      
      for (let i = baseModel.layers.length - 1; i >= 0; i--) {
        const layer = baseModel.layers[i]
        console.log(`Layer ${i}: ${layer.name}, output shape:`, layer.outputShape)

        if (
          layer.name.includes('global_average_pooling') ||
          layer.name.includes('avg_pool') ||
          (layer.name.includes('dense') && i < baseModel.layers.length - 1)
        ) {
          featureExtractor = tf.model({
            inputs: baseModel.inputs,
            outputs: layer.output
          })
          console.log('Feature extractor created from layer:', layer.name)
          break
        }
      }

      if (!featureExtractor!) {
        featureExtractor = tf.model({
          inputs: baseModel.inputs,
          outputs: baseModel.layers[baseModel.layers.length - 2].output
        })
        console.log('Using fallback feature extractor')
      }

      // Freeze feature extractor layers
      if ('layers' in featureExtractor) {
        featureExtractor.layers.forEach((layer) => {
          layer.trainable = false
        })
      }

      // Test the feature extractor to get output shape
      const testInput = tf.zeros([1, CONFIG.imageSize, CONFIG.imageSize, 3])
      const testOutput = featureExtractor.predict(testInput) as tf.Tensor
      console.log('Feature extractor output shape:', testOutput.shape)

      featureSize = testOutput.shape.slice(1).reduce((a, b) => a * b, 1)
      console.log('Feature size:', featureSize)

      testInput.dispose()
      testOutput.dispose()
    } else {
      throw new Error('Không có model nào được load thành công')
    }

    // Chỗ này xây layer
    const classifierLayers: tf.layers.Layer[] = []
    
    if (isGraphModel && featureSize === 1001) {

      //  BOTTLENECK LAYER để nén features xuống 256 features quan trọng nhất
      // λ = 0.01 
      classifierLayers.push(
        tf.layers.dense({
          inputShape: [featureSize],
          units: 256,
          activation: 'relu',
          name: 'bottleneck',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }) 
        }),
        tf.layers.dropout({ rate: 0.3 }) 
      )
    }
    
    // Lớp phân loại chính
    classifierLayers.push(
      tf.layers.dense({
        inputShape: isGraphModel && featureSize === 1001 ? [256] : [featureSize],
        units: 64, 
        activation: 'relu',
        name: 'dense1'
      }),
      tf.layers.dropout({ rate: CONFIG.dropout1 }), // Dropout 50%
      tf.layers.dense({
        units: 32, 
        activation: 'relu',
        name: 'dense2'
      }),
      tf.layers.dropout({ rate: CONFIG.dropout2 }), // Dropout 30%
      tf.layers.dense({
        units: numClasses,
        activation: 'softmax', 
        name: 'predictions'
      })
    )
    
    const classifier = tf.sequential({ layers: classifierLayers })

    classifier.compile({
      optimizer: tf.train.adam(CONFIG.learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    })

    console.log('Transfer learning model created with input shape:', [featureSize])
    return { 
      featureExtractor, 
      classifier,
      modelVersion: actualModelVersion,
      modelUrl: actualModelUrl,
      isGraphModel
    }
  }, [])

  // Train model
  const trainModel = useCallback(async () => {
    if (isTraining) return

    const totalImages = Object.values(classImages).reduce((sum, images) => sum + images.length, 0)
    const minImagesPerClass = CONFIG.minImagesPerClass

    if (totalImages < minImagesPerClass * classes.length) {
      alert(
        t('minImagesPerClass', {minImagesPerClass: minImagesPerClass, totalImages: totalImages, missingImage: minImagesPerClass * classes.length})
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
      alert(t('notBalance', {minImage: minImagesPerClass}))//
      return
    }

    setIsTraining(true)

    try {
      console.log('Bắt đầu train model thật...')
      setTrainingStatus({ message: t('dataPreparation'), type: 'info' })
      setTrainingProgress(10)

      const { images, labels } = await prepareTrainingData()
      console.log('Training data prepared:', images.shape, labels.shape)

      setTrainingStatus({ message: t('createModel'), type: 'info' })
      setTrainingProgress(20)

      const { featureExtractor, classifier } = await createTransferLearningModel(classes.length)
      console.log('Model created:', classifier)

      setTrainingStatus({ message: t('trainModel'), type: 'info' })
      setTrainingProgress(30)

      console.log('Extracting features...')
      const features = featureExtractor.predict(images) as tf.Tensor
      console.log('Features shape:', features.shape)

      const featureBatchSize = features.shape[0]
      const featureSize = features.shape.slice(1).reduce((a, b) => a * b, 1)
      const processedFeatures = features.reshape([featureBatchSize, featureSize])
      console.log('Reshaped features shape:', processedFeatures.shape)

      console.log('Training classification head...')
      
      let bestValLoss = Infinity
      let patienceCounter = 0
      let bestEpoch = 0
      let bestWeights: tf.Tensor[] | null = null
      let shouldStop = false
      

      const trainingBatchSize = Math.min(CONFIG.batchSizeMax, processedFeatures.shape[0])
      
      for (let epoch = 0; epoch < CONFIG.epochs && !shouldStop; epoch++) {

        const history = await classifier.fit(processedFeatures, labels, {
          epochs: 1,
          batchSize: trainingBatchSize,
          validationSplit: CONFIG.validationSplit,
          shuffle: true,
          verbose: 0
        })
        
        const logs = history.history
        const trainLossValue = Array.isArray(logs.loss) ? logs.loss[0] : 0
        const trainAccValue = Array.isArray(logs.acc) ? logs.acc[0] : (Array.isArray(logs.accuracy) ? logs.accuracy[0] : 0)
        const valLossValue = Array.isArray(logs.val_loss) ? logs.val_loss[0] : 0
        const valAccValue = Array.isArray(logs.val_acc) ? logs.val_acc[0] : (Array.isArray(logs.val_accuracy) ? logs.val_accuracy[0] : 0)
        
        const trainLoss = typeof trainLossValue === 'number' ? trainLossValue : 0
        const trainAcc = typeof trainAccValue === 'number' ? trainAccValue : 0
        const valLoss = typeof valLossValue === 'number' ? valLossValue : 0
        const valAcc = typeof valAccValue === 'number' ? valAccValue : 0
        
        console.log(
          `Epoch ${epoch + 1}: train_loss = ${trainLoss.toFixed(4)}, train_acc = ${trainAcc.toFixed(4)}, ` +
          `val_loss = ${valLoss.toFixed(4)}, val_acc = ${valAcc.toFixed(4)}`
        )
        
        if (valLoss > 0) {
          if (valLoss < bestValLoss - CONFIG.minDelta) {
            bestValLoss = valLoss
            patienceCounter = 0
            bestEpoch = epoch + 1
            
            bestWeights = classifier.getWeights()
            console.log(`Best val_loss: ${bestValLoss.toFixed(4)} at epoch ${bestEpoch}`)
          } else {
            patienceCounter++
            if (patienceCounter >= CONFIG.earlyStoppingPatience) {
              console.log(
                `Early stopping No improvement for ${CONFIG.earlyStoppingPatience} epochs. ` +
                `Best val_loss: ${bestValLoss.toFixed(4)} at epoch ${bestEpoch}. Restoring best weights...`
              )
              shouldStop = true
              
              if (bestWeights) {
                classifier.setWeights(bestWeights)
                console.log(`Restored best model weights from epoch ${bestEpoch}`)
              }
            }
          }
        }
        
        const progress = 30 + (epoch + 1) * (60 / CONFIG.epochs)
        setTrainingProgress(progress)
        setTrainingStatus({
          message: `Epoch ${epoch + 1}/${CONFIG.epochs}: Train ${(trainAcc * 100).toFixed(1)}% | Val ${(valAcc * 100).toFixed(1)}%`,
          type: 'info'
        })
        await tf.nextFrame()
      }
      
      if (!shouldStop && bestWeights && bestEpoch < CONFIG.epochs) {
        console.log(`Training completed. Using best model from epoch ${bestEpoch}`)
        classifier.setWeights(bestWeights)
      }

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

      setTrainingStatus({ message: t('trainSuccess'), type: 'success' })
      setTrainingProgress(100)
    } catch (error) {
      console.error('Lỗi khi train model:', error)
      setTrainingStatus({
        message: t('trainError', {error: error instanceof Error ? error.message : 'Unknown error'}),
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
      setTrainingStatus({ message: t('readyDownload'), type: 'info' })

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
          const architectureName = `MobileNet_v${MOBILENET_CONFIG.version}_Alpha${MOBILENET_CONFIG.alpha}_224_Transfer_Learning`
          const modelInfo = {
            classes,
            modelType: 'image_classification',
            architecture: architectureName,
            inputShape: [CONFIG.imageSize, CONFIG.imageSize, 3],
            outputClasses: classes.length,
            baseModel: `@tensorflow-models/mobilenet v${MOBILENET_CONFIG.version} alpha ${MOBILENET_CONFIG.alpha}`,
            baseModelPackage: '@tensorflow-models/mobilenet',
            baseModelConfig: MOBILENET_CONFIG,
            accuracy: '~70.6% on ImageNet (MobileNet v1 alpha 1.0)',
            trainingDate: new Date().toISOString(),
            description: 'Model được train bằng Teachable Machine',
            usage: {
              loadBaseModel: `Load using: import * as mobilenet from '@tensorflow-models/mobilenet'; await mobilenet.load(${JSON.stringify(MOBILENET_CONFIG)})`,
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
          t('downloadSuccess'),
        type: 'success'
      })
    } catch (error) {
      console.error('Lỗi khi tải xuống model:', error)
      setTrainingStatus({
        message: t('downloadError', {error: error instanceof Error ? error.message : 'Unknown error'}),
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
      setTrainingStatus({ message: t('imageAnalysing'), type: 'info' })

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
          message: t('predict') + `${topResult.className} (${(topResult.probability * 100).toFixed(1)}%)`,
          type: 'success'
        })

        tensor.dispose()
        normalized.dispose()
        batched.dispose()
      } catch (error) {
        console.error('Error analyzing image:', error)
        setTrainingStatus({
          message: t('imageAnalyseFail', {error: error instanceof Error ? error.message : 'Unknown error'}),
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
