"use client";

import BlocklyComponent from "@/features/blockly-self-build/components/BlocklyComponent";
import MicrobitSimulator from "@/features/blockly-self-build/components/MicrobitSimulator";
import { defaultMatrix, parseCodeForDisplay } from "@/features/blockly-self-build/libs/simulator-engine";
import { connectToMicrobit } from "@/features/blockly-self-build/libs/webusb";
import { useState } from "react";

export default function Home() {
  const [jsCode, setJsCode] = useState("// Micro:bit JS code\n");
  const [connectedDevice, setConnectedDevice] = useState<USBDevice | null>(null);
  const [ledMatrix, setLedMatrix] = useState<number[][]>(defaultMatrix());

  const handleConnect = async () => {
    const device = await connectToMicrobit();
    setConnectedDevice(device);
  };

  const handleFlash = () => {
    if (connectedDevice) {
      alert("Tính năng nạp code đang được phát triển!");
    } else {
      alert("Vui lòng kết nối Micro:bit trước.");
    }
  };

  const handleRunSimulator = () => {
    const newMatrix = parseCodeForDisplay(jsCode);
    if (newMatrix) {
      setLedMatrix(newMatrix);
    } else {
      setLedMatrix(defaultMatrix());
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Vùng Blockly */}
      <div className="w-2/3 h-full">
        <BlocklyComponent onCodeChange={setJsCode} />
      </div>

      {/* Vùng điều khiển */}
      <div className="w-1/3 h-full bg-gray-800 text-white p-4 flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-center">Bảng điều khiển</h2>

        <MicrobitSimulator matrix={ledMatrix} />

        <div className="flex flex-col space-y-2">
          <button
            onClick={handleRunSimulator}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition order-first"
          >
            ▶️ Chạy Simulator
          </button>
          <button
            onClick={handleConnect}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {connectedDevice ? `Đã kết nối: ${connectedDevice.productName}` : "Kết nối Micro:bit"}
          </button>
          <button
            onClick={handleFlash}
            disabled={!connectedDevice}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Nạp code vào Micro:bit
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Mã JavaScript</h3>
          <pre className="bg-gray-900 rounded-lg p-3 text-sm font-mono overflow-auto h-48">
            <code>{jsCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
