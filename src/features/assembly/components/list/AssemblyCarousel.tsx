'use client'

import { useState } from 'react'

const assemblies = [
  {
    id: 'assembly_1',
    name: 'Lắp Ráp Khối Bát Diện Đều',
    description: 'Khám phá khối Bát Diện Đều – một trong năm khối đa diện Platonic đã làm say mê các nhà toán học...',
    estimatedTime: 30,
    objective: 'Học viên sẽ hiểu rõ hơn về đặc điểm và ý nghĩa toán học của khối Bát Diện Đều...',
    imageUrl: '/images/placeholder.png' // dùng tạm ảnh
  },
  {
    id: 'assembly_2',
    name: 'Robot Gắp Vật',
    description: 'Mô hình robot mô phỏng chức năng gắp vật với cơ cấu đòn bẩy',
    estimatedTime: 25,
    objective: 'Luyện kỹ năng cơ khí cơ bản',
    imageUrl: '/images/grabber.png'
  }
]

export default function AssemblyCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const current = assemblies[currentIndex]

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8'>
      {/* Assembly item */}
      <div className='relative flex flex-col items-center'>
        <div className='flex h-64 w-64 items-center justify-center rounded-full bg-yellow-300 shadow-md'>
          <img src={current.imageUrl} alt={current.name} className='h-40 w-40 object-contain' />
        </div>
        <h2 className='mt-4 text-xl font-semibold'>{current.name}</h2>
        <p className='mt-2 px-4 text-center text-sm text-gray-600'>{current.description}</p>
      </div>

      {/* Pagination */}
      <div className='mt-8 flex gap-2'>
        {assemblies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-6 w-6 rounded-full border-2 border-gray-400 text-sm font-semibold ${
              index === currentIndex ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
