'use client'

import { useEffect, useRef, useState } from 'react'
import * as tmImage from '@teachablemachine/image'
import Webcam from 'react-webcam'
import { Check } from 'lucide-react'
import { loadModelFromZip } from '@/features/AI-model/utils/loadModelFromZip'
import JSZip from 'jszip'
import * as tf from '@tensorflow/tfjs'
import { useTranslations } from 'next-intl'

export default function MicroAI({ modelUrl, zipFile }: { modelUrl?: string; zipFile?: File }) {
  const t = useTranslations('agent.modelMaker.microbit')
  const tc = useTranslations('common')
  // --- Refs ---
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null)
  const webcamRef = useRef<Webcam | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const portRef = useRef<SerialPort | null>(null)
  const lastCommandRef = useRef<string | null>(null)
  const cooldownRef = useRef<number>(0)

  // --- State ---
  const [status, setStatus] = useState<'idle' | 'loading' | 'running'>('idle')
  const [predictions, setPredictions] = useState<{ className: string; probability: number }[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [deviceName, setDeviceName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // --- Logic giữ nguyên ---
  const init = async (zipFile?: File) => {
    setStatus('loading')
    setPredictions([])
    setError(null)

    try {
      if (!zipFile) throw new Error('Hãy chọn file model .zip')

      // 1) Đọc zip
      const zip = await JSZip.loadAsync(zipFile)
      const jsonFile = zip.file('model.json')
      const binFile = zip.file('trained-classifier.weights.bin')
      const labelsFile = zip.file('labels.json')
      if (!jsonFile || !binFile) {
        throw new Error('Thiếu model.json hoặc trained-classifier.weights.bin trong zip')
      }

      const classifierJsonText = await jsonFile.async('text')
      const classifierJson = JSON.parse(classifierJsonText) // chính là topology Sequential của bạn
      const weightData = await binFile.async('arraybuffer')

      let labels: string[] = []
      if (labelsFile) {
        const txt = await labelsFile.async('text')
        const obj = JSON.parse(txt)
        labels = Array.isArray(obj.labels) ? obj.labels : []
      }
      const numClasses = labels.length > 0 ? labels.length : 2

      // 2) Load MobileNet và tạo feature extractor = GAP(conv_pw_13_relu) => [?,256]
      const BASE = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
      const baseModel = await tf.loadLayersModel(BASE)

      // Lấy output của layer cuối khối conv_pw_13_relu
      const conv = baseModel.getLayer('conv_pw_13_relu') // tồn tại ở MobileNet v1 0.25_224
      // Quan trọng: dùng GAP để ra vector 256, KHÔNG flatten 7*7*256
      const gap = tf.layers.globalAveragePooling2d({}).apply(conv.output as tf.SymbolicTensor) as tf.SymbolicTensor
      const featureExtractor = tf.model({
        inputs: baseModel.inputs,
        outputs: gap
      })

      // 3) weightSpecs phải khớp hoàn toàn thứ tự / shape với .bin
      const weightSpecs: tf.io.WeightsManifestEntry[] = [
        { name: 'dense1/kernel', shape: [256, 32], dtype: 'float32' },
        { name: 'dense1/bias', shape: [32], dtype: 'float32' },
        { name: 'dense2/kernel', shape: [32, 16], dtype: 'float32' },
        { name: 'dense2/bias', shape: [16], dtype: 'float32' },
        { name: 'predictions/kernel', shape: [16, numClasses], dtype: 'float32' },
        { name: 'predictions/bias', shape: [numClasses], dtype: 'float32' }
      ]

      // 4) IOHandler tự cung cấp topology + weights
      const ioHandler: tf.io.IOHandler = {
        load: async () => ({
          modelTopology: classifierJson, // chính object JSON bạn đưa ở trên
          weightSpecs,
          weightData
        })
      }

      // 5) Load classifier từ IOHandler
      const classifier = await tf.loadLayersModel(ioHandler)
      console.log('Classifier reconstructed & loaded')

      // 6) Ghép featureExtractor (224x224x3 -> [?,256]) vào classifier ([?,256] -> logits)
      const combinedOutput = classifier.apply(featureExtractor.outputs[0] as tf.SymbolicTensor) as tf.SymbolicTensor
      const combinedModel = tf.model({
        inputs: featureExtractor.inputs,
        outputs: combinedOutput
      })

      // 7) Gói lại API predict như TeachableMachine
      const wrapped = {
        model: combinedModel,
        async predict(video: HTMLVideoElement) {
          return tf.tidy(() => {
            const img = tf.browser.fromPixels(video).resizeNearestNeighbor([224, 224]).toFloat().div(255).expandDims(0) // [1,224,224,3]

            const logits = combinedModel.predict(img) as tf.Tensor
            const probs = logits.dataSync() // Float32Array
            const names = labels.length ? labels : Array.from({ length: numClasses }, (_, i) => `Class ${i + 1}`)
            return names
              .map((name, i) => ({ className: name, probability: probs[i] ?? 0 }))
              .sort((a, b) => b.probability - a.probability)
          })
        }
      }

      modelRef.current = wrapped as any
      console.log('Combined model ready')
      setStatus('running')
      animationFrameRef.current = requestAnimationFrame(loop)
    } catch (e: any) {
      console.error('Lỗi khi tải model:', e)
      setError(e?.message ?? String(e))
      setStatus('idle')
    }
  }

  const loop = async () => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video as HTMLVideoElement
      if (modelRef.current) {
        const prediction = await modelRef.current.predict(video)
        setPredictions(prediction)

        if (prediction && prediction.length > 0) {
          const best = prediction.reduce((max, p) => (p.probability > max.probability ? p : max), prediction[0])
          if (best && best.probability >= 0.8) {
            const command = best.className
            const now = Date.now()
            if (command !== lastCommandRef.current || now > cooldownRef.current) {
              await sendCommandToMicrobit(command)
              lastCommandRef.current = command
              cooldownRef.current = now + 1000
            }
          }
        }
      }
    }
    animationFrameRef.current = window.requestAnimationFrame(loop)
  }

  const connectMicrobit = async () => {
    try {
      if (!('serial' in navigator)) {
        alert('Trình duyệt không hỗ trợ Web Serial. Dùng Chrome/Edge mới nhất.')
        return
      }
      const port = await navigator.serial.requestPort()
      await port.open({ baudRate: 115200 })
      portRef.current = port
      setIsConnected(true)
      const info = port.getInfo()
      setDeviceName(info ? `${info.usbVendorId ?? ''}:${info.usbProductId ?? ''}` : 'Micro:bit')
    } catch (err: any) {
      setError('Không kết nối được Micro:bit. Kiểm tra quyền trình duyệt.')
    }
  }

  const disconnectMicrobit = async () => {
    if (portRef.current) {
      try {
        await portRef.current.close()
        portRef.current = null
        setIsConnected(false)
        setDeviceName(null)
      } catch (err) {
        console.error('Lỗi khi ngắt kết nối:', err)
        portRef.current = null
        setIsConnected(false)
        setDeviceName(null)
      }
    }
  }

  const sendCommandToMicrobit = async (command: string) => {
    if (!portRef.current?.writable) return
    try {
      const writer = portRef.current.writable.getWriter()
      const encoder = new TextEncoder()
      await writer.write(encoder.encode(command + '\n'))
      writer.releaseLock()
      console.log('Đã gửi lệnh:', command)
    } catch (err) {
      console.error('Lỗi khi gửi lệnh đến Micro:bit:', err)
    }
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      portRef.current?.close().catch(console.error)
    }
  }, [])

  // =========================
  // UI: Video to hơn bên phải, kết quả bên trái
  // =========================
  const bestIndex =
    predictions.length > 0
      ? predictions.reduce((bi, p, i, arr) => (p.probability > arr[bi].probability ? i : bi), 0)
      : -1

  return (
    <main className='min-h-screen w-full bg-neutral-50'>
      {/* Header */}
      <section className='mx-auto max-w-6xl px-6 pt-2'>
        <div className='flex flex-col items-center text-center'>
          <h1 className='text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl'>IMAGE MODEL</h1>
          <p
            className={[
              'mt-3 rounded-full px-4 py-1 text-sm font-medium ring-1',
              status === 'running'
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                : status === 'loading'
                  ? 'bg-amber-50 text-amber-700 ring-amber-200'
                  : 'bg-slate-50 text-slate-700 ring-slate-200'
            ].join(' ')}
          >
            {status === 'idle' && t('instruction')}
            {status === 'loading' && 'Đang tải model & khởi động...'}
            {status === 'running' && 'Hệ thống đang hoạt động…'}
          </p>

          {/* Controls */}
          <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
            {status === 'idle' && (
              <button
                onClick={() => init(zipFile)}
                className='rounded-full bg-amber-400 px-6 py-3 text-white shadow-lg transition hover:bg-amber-500'
              >
                {tc('button.start')}
              </button>
            )}
            {isConnected ? (
              <button
                onClick={disconnectMicrobit}
                className='rounded-full bg-red-600 px-6 py-3 text-white shadow-lg transition hover:bg-red-700'
              >
                {tc('button.disconnect')}: {deviceName ?? 'Micro:bit'}
              </button>
            ) : (
              <button
                onClick={connectMicrobit}
                className='rounded-full bg-sky-400 px-6 py-3 text-white shadow-lg transition hover:bg-sky-500'
              >
                {tc('button.connect')} Micro:bit
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content: Left results, Right big video */}
      {(status === 'loading' || status === 'running') && (
        <section className='mx-auto mt-8 max-w-6xl px-6'>
          <div className='grid grid-cols-1 gap-10 lg:grid-cols-12'>
            {/* LEFT: Results like mock */}
            <div className='lg:col-span-5'>
              <div className='rounded-[28px] border border-slate-300 bg-white p-6 shadow-sm'>
                <div className='rounded-[22px] border border-slate-300 p-6'>
                  <h3 className='text-3xl font-extrabold tracking-wide text-slate-900'>{t('result')}</h3>

                  {status === 'loading' && (
                    <div className='mt-6 flex items-center gap-2 text-slate-600'>
                      <span className='h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-.3s]' />
                      <span className='h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-.15s]' />
                      <span className='h-2 w-2 animate-bounce rounded-full bg-slate-400' />
                      <span className='ml-2'>{t('uploading')}</span>
                    </div>
                  )}

                  <ul className='mt-6 space-y-5'>
                    {predictions.map((p, i) => {
                      const percent = Math.min(100, Math.max(0, Math.round(p.probability * 100)))
                      const isBest = i === bestIndex
                      // màu chữ nhạt kiểu "nhan" / "linh" trong hình
                      const labelColor = i === 0 ? 'text-rose-400' : i === 1 ? 'text-amber-500' : 'text-slate-500'

                      return (
                        <li key={i} className='flex items-center gap-4'>
                          {/* label bên trái */}
                          <div className={`w-20 shrink-0 text-base font-semibold lowercase ${labelColor}`}>
                            {p.className}
                          </div>

                          {/* progress */}
                          <div className='relative mr-2 h-8 w-full overflow-hidden rounded-full bg-neutral-100 ring-1 ring-black/5'>
                            <div
                              className='absolute inset-y-0 left-0 h-full rounded-full bg-emerald-600 transition-[width] duration-500 ease-out'
                              style={{ width: `${percent}%` }}
                            />
                            {/* 2) Vệt sáng: chỉ hiện khi chưa đầy 100% */}
                            <div
                              className='pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-full bg-white/60'
                              style={{ opacity: percent > 6 && percent < 99 ? 1 : 0 }}
                            />
                            <div className='absolute inset-0 flex items-center justify-center text-sm font-semibold text-white drop-shadow'>
                              {percent}%
                            </div>
                          </div>

                          {/* check cho best */}
                          <div className='w-6 shrink-0 font-bold text-emerald-600'>{isBest ? <Check /> : ''}</div>
                        </li>
                      )
                    })}
                  </ul>

                  {/* nút reset chỉ là UI (không chạm logic) */}
                  <div className='mt-8'>
                    <button
                      className='w-full rounded-[40px] border-2 border-black bg-white px-6 py-4 text-center text-lg font-semibold text-slate-400 shadow-[0_6px_0_#000] active:translate-y-[3px] active:shadow-[0_3px_0_#000]'
                      disabled
                      title='Chỉ hiển thị UI (không thay đổi logic hiện tại)'
                    >
                      {t('reset')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className='mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700'>
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* RIGHT: Big video */}
            <div className='lg:col-span-7'>
              <div className='relative rounded-3xl bg-white/80 p-5 shadow-xl ring-1 ring-slate-200 backdrop-blur'>
                <div className='absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-indigo-200 via-sky-200 to-transparent opacity-60 blur-2xl' />
                <div className='mx-auto flex aspect-video max-w-[720px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-inner'>
                  <div className='rounded-2xl ring-2 ring-indigo-500/60 ring-offset-2 ring-offset-white'>
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      mirrored={true}
                      // Tăng kích thước video (UI only)
                      width={640}
                      height={360}
                      className='rounded-xl'
                    />
                  </div>
                </div>
                <p className='mt-4 text-center text-sm text-slate-500'>{t('video')}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
