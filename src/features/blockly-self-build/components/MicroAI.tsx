'use client'

import { useEffect, useRef, useState } from 'react'
import * as tmImage from '@teachablemachine/image'
import Webcam from 'react-webcam'

export default function MicroAI() {
  const MODEL_PATH = '/my-model/'

  // --- Refs ---
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null)
  const webcamRef = useRef<Webcam | null>(null)
  const rafRef = useRef<number | null>(null)
  const portRef = useRef<SerialPort | null>(null)
  const lastCommandRef = useRef<string | null>(null)
  const cooldownRef = useRef<number>(0)

  // --- State ---
  const [predictions, setPredictions] = useState<{ className: string; probability: number }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [deviceName, setDeviceName] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'running'>('idle')

  useEffect(() => {
    const loadModel = async () => {
      try {
        setStatus('loading')
        setError(null)
        console.log('📦 uploading model...')
        const modelURL = MODEL_PATH + 'model.json'
        const metadataURL = MODEL_PATH + 'metadata.json'
        modelRef.current = await tmImage.load(modelURL, metadataURL)
        console.log('✅ models uploaded successfully!', modelRef.current)
        setStatus('ready')
      } catch (err) {
        console.error('❌ error when uploading model:', err)
        setError('Unable to load model. Please check the link again.')
        setStatus('idle')
      }
    }
    loadModel()
  }, [])

  const loop = async () => {
    if (status === 'running') {
      rafRef.current = window.requestAnimationFrame(loop)
    }

    if (!webcamRef.current || !webcamRef.current.video) {
      return
    }

    const video = webcamRef.current.video as HTMLVideoElement

    if (video.readyState < 3) {
      return
    }

    try {
      const prediction = await modelRef.current!.predict(video)

      if (prediction && prediction.length > 0) {
        setPredictions(prediction.map((p) => ({ className: p.className, probability: p.probability })))

        let best = prediction[0]
        for (let i = 1; i < prediction.length; i++) {
          if (prediction[i].probability > best.probability) {
            best = prediction[i]
          }
        }

        const THRESH = 0.8
        const now = Date.now()

        if (best.probability >= THRESH) {
          const command = best.className
          if (command === 'Boat') {
            console.log('"Boat"')
            await sendCommandToMicrobit('Boat')
          } else if (command === 'bridge') {
            console.log('"bridge"')
            await sendCommandToMicrobit('bridge')
          }
        }
      }
    } catch (err) {
      console.error('err in loop:', err)
    }
  }

  const handleStartStopClick = () => {
    if (status === 'running') {
      setStatus('ready')
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    } else if (status === 'ready') {
      setStatus('running')
      rafRef.current = window.requestAnimationFrame(loop)
    }
  }

  const handleReset = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setStatus('ready')
    setPredictions([])
    lastCommandRef.current = null
    console.log('AI recognition has been reset.')
  }

  const connectMicrobit = async () => {
    try {
      if (!('serial' in navigator)) {
        alert('Browser does not support Web Serial. Use latest Chrome/Edge.')
        return
      }
      const port = await navigator.serial.requestPort()
      await port.open({ baudRate: 115200 })
      portRef.current = port
      setIsConnected(true)
      const info = port.getInfo()
      setDeviceName(info ? `${info.usbVendorId ?? ''}:${info.usbProductId ?? ''}` : 'Micro:bit')
    } catch (err: any) {
      setError('Micro:bit cannot be connected. Check browser permissions.')
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
        console.error(err)
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
      console.log('📤 send cmd:', command)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    return () => {
      portRef.current?.close().catch(console.error)
    }
  }, [])

  const isLoading = status === 'loading'
  const isReady = status === 'ready'
  const isRunning = status === 'running'

  let winner = null
  if (predictions.length > 0) {
    winner = predictions.reduce((prev, current) => (prev.probability > current.probability ? prev : current))
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-start bg-gray-50 p-6'>
      <h1 className='mt-8 text-center text-3xl font-bold text-gray-800'>🧠 Recognition Image With AI</h1>
      <p className='mb-6 text-center text-gray-600'>Press the button to start or stop the project.</p>

      <div className='w-full max-w-2xl px-4'>
        <div className='flex gap-3'>
          <button
            onClick={handleStartStopClick}
            disabled={isLoading || status === 'idle'}
            className={`flex-1 rounded-lg px-6 py-3 text-white shadow transition-colors ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700'
                : isLoading || status === 'idle'
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? 'Stop predicting' : isReady ? 'Start predicting' : 'Uploading model...'}
          </button>

          {isConnected ? (
            <button
              onClick={disconnectMicrobit}
              className='flex-1 rounded-lg bg-orange-500 px-6 py-3 text-white shadow transition-colors hover:bg-orange-600'
            >
              Disconnect: {deviceName ?? 'Micro:bit'}
            </button>
          ) : (
            <button
              onClick={connectMicrobit}
              className='flex-1 rounded-lg bg-blue-500 px-6 py-3 text-white shadow transition-colors hover:bg-blue-600'
            >
              Connect Micro:bit
            </button>
          )}
        </div>

        <div className='mt-6 flex items-start gap-6'>
          <div className='h-[224px] w-[224px] flex-none overflow-hidden rounded-lg bg-gray-200 shadow-md'>
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={true}
              width={224}
              height={224}
              videoConstraints={{ width: 224, height: 224, facingMode: 'user' }}
            />
          </div>

          <div className='flex-1'>
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-xl font-bold text-gray-800'>RESULTS!</h3>

              {!isRunning || predictions.length === 0 ? (
                <p className='text-gray-500'>Chưa có dự đoán. Hãy nhấn "Bắt đầu".</p>
              ) : (
                <ul>
                  {predictions.map((p, i) => (
                    <li key={i} className='mb-4 grid grid-cols-12 items-center gap-4'>
                      <span className='col-span-3 font-semibold text-pink-500 capitalize'>{p.className}</span>
                      <div className='col-span-7 flex items-center gap-2'>
                        <div className='h-5 w-full overflow-hidden rounded-full bg-orange-100'>
                          <div
                            className='h-5 rounded-full bg-teal-500 transition-all duration-300 ease-in-out'
                            style={{ width: `${p.probability * 100}%` }}
                          ></div>
                        </div>
                        <span className='font-mono text-gray-700'>{(p.probability * 100).toFixed(0)}%</span>
                      </div>
                      <div className='col-span-2 flex justify-center'>
                        {winner && winner.className === p.className && winner.probability > 0.9 && (
                          <span className='text-3xl font-bold text-teal-500'>✓</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {isRunning && (
                <div className='mt-6 flex justify-center'>
                  <button
                    onClick={handleReset}
                    className='rounded-full border-2 border-gray-800 px-8 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-800 hover:text-white'
                  >
                    Reset the AI recognition
                  </button>
                </div>
              )}
            </div>
            {error && <p className='mt-3 text-red-500'>{error}</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
