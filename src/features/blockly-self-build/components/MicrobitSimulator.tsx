// components/MicrobitSimulator.tsx

import React from 'react';

interface MicrobitSimulatorProps {
  matrix: number[][];
}

export default function MicrobitSimulator({ matrix }: MicrobitSimulatorProps) {
  return (
    // Thêm đường viền để simulator luôn nổi bật
    <div className="bg-black p-4 rounded-lg flex flex-col items-center border-2 border-gray-700">
      <div 
        className="grid grid-cols-5 gap-2 w-48 h-48 mb-2"
        aria-label="Micro:bit 5x5 LED matrix"
      >
        {matrix.flat().map((brightness, index) => {
          // Xác định xem đèn có sáng không
          const isLit = brightness > 0;
          
          // Đèn tắt sẽ có màu đỏ sẫm, đèn sáng có màu đỏ tươi
          const ledColor = isLit ? `#ff5633` : '#440000';
          const boxShadow = isLit ? '0 0 10px #FF5555' : 'none';

          return (
            <div
              key={index}
              className="w-full h-full rounded-full transition-all duration-150"
              style={{
                backgroundColor: ledColor,
                boxShadow: boxShadow,
              }}
            />
          );
        })}
      </div>
      <p className="text-sm text-gray-400">Micro:bit Simulator</p>
    </div>
  );
}