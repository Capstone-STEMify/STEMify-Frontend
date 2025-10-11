'use client'

import { useEffect, useRef, useState } from 'react'
import * as tmImage from '@teachablemachine/image'
import Webcam from 'react-webcam'

export default function MicroAI() {
  // --- Refs ---
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const portRef = useRef<SerialPort | null>(null);
  const lastCommandRef = useRef<string | null>(null);
  const cooldownRef = useRef<number>(0);

  // --- State ---
  const [status, setStatus] = useState<'idle' | 'loading' | 'running'>('idle');
  const [predictions, setPredictions] = useState<{ className: string; probability: number }[]>([]);
  // Thêm lại state cho Micro:bit
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hàm khởi tạo chính
  const init = async () => {
    setStatus('loading');
    setPredictions([]);

    const MODEL_PATH = "/my-model/";
    const modelURL = MODEL_PATH + "model.json";
    const metadataURL = MODEL_PATH + "metadata.json";

    try {
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      modelRef.current = loadedModel;
      setStatus('running');
      animationFrameRef.current = window.requestAnimationFrame(loop);
    } catch (error) {
      console.error("Lỗi khi tải model:", error);
      setStatus('idle');
    }
  };

  const loop2 = async () => {
    if (status !== 'running') return; // Dừng nếu không còn chạy

    try {
      if (webcamRef.current?.video?.readyState === 4) {
        const video = webcamRef.current.video as HTMLVideoElement;
        
        if (modelRef.current) {
          const prediction = await modelRef.current.predict(video);
          
          // Cập nhật giao diện ngay lập tức với kết quả thô
          setPredictions(prediction);

          // --- KIỂM TRA AN TOÀN TRƯỚC KHI XỬ LÝ ---
          // Chỉ tìm 'best' và gửi lệnh nếu mảng 'prediction' có chứa dữ liệu
          if (prediction && prediction.length > 0) {
            const best = prediction.reduce((max, p) => p.probability > max.probability ? p : max, prediction[0]);
            
            if (best && best.probability >= 0.95) {
              const command = best.className;
              const now = Date.now();

              if (command !== lastCommandRef.current || now > cooldownRef.current) {
                if (command === 'Boat') {
                  sendCommandToMicrobit('Boat');
                  lastCommandRef.current = 'Boat';
                  cooldownRef.current = now + 2000;
                } else if (command === 'bridge') {
                  sendCommandToMicrobit('bridge');
                  lastCommandRef.current = 'bridge';
                  cooldownRef.current = now + 2000;
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Lỗi trong vòng lặp dự đoán:", err);
    } finally {
      // Luôn lên lịch cho frame tiếp theo
      if (status === 'running') {
        animationFrameRef.current = window.requestAnimationFrame(loop);
      }
    }
  };

  const loop = async () => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video as HTMLVideoElement;
      
      // Thực hiện dự đoán
      if (modelRef.current) {
        const prediction = await modelRef.current.predict(video);
        setPredictions(prediction);

        if (prediction && prediction.length > 0) {
            const best = prediction.reduce((max, p) => p.probability > max.probability ? p : max, prediction[0]);
            
            if (best && best.probability >= 0.8) {
              const command = best.className;
              const now = Date.now();

              if (command !== lastCommandRef.current || now > cooldownRef.current) {
                if (command === 'Boat') {
                  sendCommandToMicrobit('Boat');
                  lastCommandRef.current = 'Boat';
                  cooldownRef.current = now + 2000;
                } else if (command === 'bridge') {
                  sendCommandToMicrobit('bridge');
                  lastCommandRef.current = 'bridge';
                  cooldownRef.current = now + 2000;
                }
              }
            }
          }
      }
    }

    animationFrameRef.current = window.requestAnimationFrame(loop);
  };

  const connectMicrobit = async () => {
    try {
      if (!('serial' in navigator)) {
        alert('Trình duyệt không hỗ trợ Web Serial. Dùng Chrome/Edge mới nhất.');
        return;
      }
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });
      portRef.current = port;
      setIsConnected(true);
      const info = port.getInfo();
      setDeviceName(info ? `${info.usbVendorId ?? ''}:${info.usbProductId ?? ''}` : 'Micro:bit');
    } catch (err: any) {
      setError('Không kết nối được Micro:bit. Kiểm tra quyền trình duyệt.');
    }
  };

  const disconnectMicrobit = async () => {
    if (portRef.current) {
      try {
        await portRef.current.close();
        portRef.current = null;
        setIsConnected(false);
        setDeviceName(null);
      } catch (err) {
        console.error("Lỗi khi ngắt kết nối:", err);
        // Reset state dù có lỗi
        portRef.current = null;
        setIsConnected(false);
        setDeviceName(null);
      }
    }
  };

  const sendCommandToMicrobit = async (command: string) => {
    if (!portRef.current?.writable) return;
    try {
      const writer = portRef.current.writable.getWriter();
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(command + '\n'));
      writer.releaseLock();
      console.log('📤 Đã gửi lệnh:', command);
    } catch (err) {
      console.error('Lỗi khi gửi lệnh đến Micro:bit:', err);
    }
  };

  // Dọn dẹp tài nguyên
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      portRef.current?.close().catch(console.error);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-6">
      <h1 className="mt-8 text-center text-3xl font-bold text-gray-800">🧠 Cầu Nâng Tự Động</h1>
      <p className="mb-6 text-center text-gray-600">
        {status === 'idle' ? 'Nhấn "Bắt đầu" để khởi động hệ thống.' : 'Hệ thống đang hoạt động...'}
      </p>
      
      <div className="flex w-full max-w-md justify-center gap-4">
        {status === 'idle' && (
          <button onClick={init} className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-white shadow transition-colors hover:bg-blue-700">
            Bắt đầu
          </button>
        )}

        {isConnected ? (
          <button onClick={disconnectMicrobit} className="flex-1 rounded-lg bg-orange-500 px-6 py-3 text-white shadow transition-colors hover:bg-orange-600">
            Ngắt kết nối: {deviceName ?? 'Micro:bit'}
          </button>
        ) : (
          <button onClick={connectMicrobit} className="flex-1 rounded-lg bg-blue-500 px-6 py-3 text-white shadow transition-colors hover:bg-blue-600">
            Kết nối Micro:bit
          </button>
        )}
      </div>

      {(status === 'loading' || status === 'running') && (
        <div className="mt-6 flex flex-col items-center gap-6">
          <div className="h-[224px] w-[224px] rounded-lg bg-gray-200 shadow-md overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={true}
              width={224}
              height={224}
            />
          </div>
          <div className="w-full max-w-xs p-4 rounded-lg bg-white shadow">
            <h3 className="text-center text-xl font-bold mb-2">Kết quả</h3>
            {status === 'loading' && <p className="text-center text-gray-500">Đang tải model...</p>}
            {predictions.length > 0 ? (
              <ul className="text-center">
                {predictions.map((p, i) => (
                  <li key={i} className="text-lg">
                    {p.className}: {(p.probability * 100).toFixed(0)}%
                  </li>
                ))}
              </ul>
            ) : (
              status === 'running' && <p className="text-gray-500 text-center">Đang chờ nhận diện...</p>
            )}
          </div>
        </div>
      )}
       {error && <p className="mt-4 text-red-500">{error}</p>}
    </main>
  );
}