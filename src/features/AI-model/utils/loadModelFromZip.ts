import JSZip from 'jszip'
import * as tf from '@tensorflow/tfjs'

export async function loadModelFromZip(file: File) {
  const zip = await JSZip.loadAsync(file)
  const files = Object.keys(zip.files)

  // Kiểm tra các file quan trọng
  const modelJsonFile = files.find((f) => f.endsWith('model.json'))
  const weightsFile = files.find((f) => f.endsWith('.bin'))
  const labelsFile = files.find((f) => f.includes('labels.json'))

  if (!modelJsonFile || !weightsFile) throw new Error('Thiếu file model.json hoặc weights.bin trong ZIP')

  // Đọc model.json và weights
  const modelJsonBlob = await zip.file(modelJsonFile)!.async('blob')
  const weightsBlob = await zip.file(weightsFile)!.async('blob')

  const jsonFile = new File([modelJsonBlob], 'model.json', { type: 'application/json' })
  const binFile = new File([weightsBlob], 'weights.bin', { type: 'application/octet-stream' })

  // Load model bằng TensorFlow.js
  const model = await tf.loadLayersModel(tf.io.browserFiles([jsonFile, binFile]))

  // Đọc nhãn (nếu có)
  let labels: string[] = []
  if (labelsFile) {
    const labelsText = await zip.file(labelsFile)!.async('string')
    const parsed = JSON.parse(labelsText)
    labels = parsed.labels ?? []
  }

  return { model, labels }
}
