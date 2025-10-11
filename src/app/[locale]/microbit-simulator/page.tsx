'use client'

import BlocklyComponent from '@/features/blockly-self-build/components/BlocklyComponent'
import MicrobitSimulator from '@/features/blockly-self-build/components/MicrobitSimulator'
import { defaultMatrix, parseCodeForDisplay } from '@/features/blockly-self-build/libs/simulator-engine'
import { connectToMicrobit } from '@/features/blockly-self-build/libs/webusb'
import { useState } from 'react'

export default function Home() {
  const [jsCode, setJsCode] = useState('// Micro:bit JS code\n')
  const [connectedDevice, setConnectedDevice] = useState<USBDevice | null>(null)
  const [ledMatrix, setLedMatrix] = useState<number[][]>(defaultMatrix())

  const handleConnect = async () => {
    const device = await connectToMicrobit()
    //setConnectedDevice(device)
  }

  const handleFlash = () => {
    if (connectedDevice) {
      alert('Tính năng nạp code đang được phát triển!')
    } else {
      alert('Vui lòng kết nối Micro:bit trước.')
    }
  }

  //   const handleRunSimulator = () => {
  //     const newMatrix = parseCodeForDisplay(jsCode);
  //     if (newMatrix) {
  //       setLedMatrix(newMatrix);
  //     } else {
  //       setLedMatrix(defaultMatrix());
  //     }
  //   };

  const handleRunSimulator = () => {
    parseCodeForDisplay(jsCode, (frame) => {
      setLedMatrix(frame)
    })
  }

  return (
    <div className='flex h-screen bg-gray-100 font-sans'>
      {/* Vùng Blockly */}
      <div className='h-full w-2/3'>
        <BlocklyComponent onCodeChange={setJsCode} />
      </div>

      {/* Vùng điều khiển */}
      <div className='flex h-full w-1/3 flex-col space-y-4 bg-gray-800 p-4 text-white'>
        <h2 className='text-center text-xl font-bold'>Bảng điều khiển</h2>

        <MicrobitSimulator matrix={ledMatrix} />

        <div className='flex flex-col space-y-2'>
          <button
            onClick={handleRunSimulator}
            className='order-first w-full rounded-lg bg-green-600 px-4 py-2 font-bold text-white transition hover:bg-green-700'
          >
            ▶️ Chạy Simulator
          </button>
          <button
            onClick={handleConnect}
            className='w-full rounded-lg bg-blue-500 px-4 py-2 font-bold text-white transition hover:bg-blue-600'
          >
            {connectedDevice ? `Đã kết nối: ${connectedDevice.productName}` : 'Kết nối Micro:bit'}
          </button>
          <button
            onClick={handleFlash}
            disabled={!connectedDevice}
            className='w-full rounded-lg bg-gray-500 px-4 py-2 font-bold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-700'
          >
            Nạp code vào Micro:bit
          </button>
        </div>

        <div>
          <h3 className='mb-2 text-lg font-semibold'>Mã JavaScript</h3>
          <pre className='h-48 overflow-auto rounded-lg bg-gray-900 p-3 font-mono text-sm'>
            <code>{jsCode}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
