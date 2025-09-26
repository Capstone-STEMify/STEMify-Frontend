import React from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Quote,
  Code,
  Highlighter
} from 'lucide-react'

const smilieMap: [string, string][] = [
  [':-)', '🙂'],
  [':D', '😃'],
  [';)', '😉'],
  [':P', '😛'],
  ['<3', '❤️'],
  [':-(', '😞'],
  [":'(", '😢'],
  [':O', '😮'],
  ['B-)', '😎'],
  [':-*', '😘'],
  ['O:-)', '😇'],
  ['/shrug', '¯\\_(ツ)_/¯']
]

export default function GuideContent() {
  return (
    <div className=''>
      <h3 className='text-center text-lg font-bold'>Hướng dẫn sử dụng Editor</h3>

      <ol className='list-decimal space-y-6 pl-2'>
        {/* Định dạng */}
        <li>
          <strong>Định dạng văn bản</strong>
          <div className='mt-2 flex flex-wrap gap-3'>
            <span className='flex items-center gap-1 text-blue-600'>
              <Bold className='h-4 w-4' /> In đậm (<code>Ctrl + B</code>)
            </span>
            <span className='flex items-center gap-1 text-green-600'>
              <Italic className='h-4 w-4' /> In nghiêng (<code>Ctrl + I</code>)
            </span>
            <span className='flex items-center gap-1 text-purple-600'>
              <Underline className='h-4 w-4' /> Gạch chân (<code>Ctrl + U</code>)
            </span>
            <span className='flex items-center gap-1 text-red-600'>
              <Strikethrough className='h-4 w-4' /> Gạch ngang
            </span>
          </div>
        </li>

        {/* Căn chỉnh */}
        <li>
          <strong>Căn chỉnh đoạn</strong>
          <div className='mt-2 flex flex-wrap gap-3'>
            <span className='flex items-center gap-1'>
              <AlignLeft className='h-4 w-4 text-gray-700' /> Trái
            </span>
            <span className='flex items-center gap-1'>
              <AlignCenter className='h-4 w-4 text-gray-700' /> Giữa
            </span>
            <span className='flex items-center gap-1'>
              <AlignRight className='h-4 w-4 text-gray-700' /> Phải
            </span>
            <span className='flex items-center gap-1'>
              <AlignJustify className='h-4 w-4 text-gray-700' /> Canh đều
            </span>
          </div>
        </li>

        {/* Danh sách */}
        <li>
          <strong>Danh sách</strong>
          <div className='mt-2 flex flex-wrap gap-3'>
            <span className='flex items-center gap-1 text-orange-600'>
              <List className='h-4 w-4' /> Bullet list
            </span>
            <span className='flex items-center gap-1 text-teal-600'>
              <ListOrdered className='h-4 w-4' /> Numbered list
            </span>
          </div>
        </li>

        {/* Link, hình, video */}
        <li>
          <strong>Chèn liên kết & phương tiện</strong>
          <div className='mt-2 flex flex-wrap gap-3'>
            <span className='flex items-center gap-1 text-blue-500'>
              <LinkIcon className='h-4 w-4' /> Thêm link
            </span>
            <span className='flex items-center gap-1 text-pink-500'>
              <ImageIcon className='h-4 w-4' /> Hình ảnh
            </span>
            <span className='flex items-center gap-1 text-rose-500'>
              <VideoIcon className='h-4 w-4' /> Video
            </span>
          </div>
        </li>

        {/* Khối đặc biệt */}
        <li>
          <strong>Khối đặc biệt</strong>
          <div className='mt-2 flex flex-wrap gap-3'>
            <span className='flex items-center gap-1 text-gray-600'>
              <Quote className='h-4 w-4' /> Quote
            </span>
            <span className='flex items-center gap-1 text-yellow-600'>
              <Code className='h-4 w-4' /> Code Block
            </span>
          </div>
        </li>

        {/* Màu sắc */}
        <li>
          <strong>Màu sắc & Highlight</strong>
          <div className='mt-2 flex items-center gap-2'>
            <span className='flex items-center gap-1'>
              <Highlighter className='h-4 w-4 text-yellow-400' /> Highlight
            </span>
            <div className='ml-2 flex gap-1'>
              <span className='h-5 w-5 rounded bg-red-500' title='Đỏ'></span>
              <span className='h-5 w-5 rounded bg-green-500' title='Xanh lá'></span>
              <span className='h-5 w-5 rounded bg-blue-500' title='Xanh dương'></span>
              <span className='h-5 w-5 rounded bg-yellow-400' title='Vàng'></span>
              <span className='h-5 w-5 rounded bg-purple-500' title='Tím'></span>
            </div>
          </div>
        </li>

        {/* Emoji */}
        <li>
          <strong>Biểu tượng cảm xúc (Emoji):</strong>
          Khi bạn gõ ký hiệu và nhấn <kbd>Space</kbd> hoặc <kbd>Enter</kbd>, editor sẽ tự động chuyển thành emoji.
          <table className='mt-3 table-auto border-collapse border border-gray-300 text-sm'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 px-2 py-1'>Ký hiệu</th>
                <th className='border border-gray-300 px-2 py-1'>Emoji</th>
              </tr>
            </thead>
            <tbody>
              {smilieMap.map(([key, emoji]) => (
                <tr key={key}>
                  <td className='border border-gray-300 px-2 py-1 font-mono'>{key}</td>
                  <td className='border border-gray-300 px-2 py-1 text-lg'>{emoji}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </li>

        {/* Mã màu */}
        <li>
          <strong>Mã màu (Color Highlighter):</strong>
          Khi bạn gõ mã màu HEX (ví dụ: <code>#ff0000</code>), editor sẽ hiển thị đúng màu.
          <div className='mt-2 flex gap-2'>
            <span className='rounded border bg-[#ff0000] px-2 py-1 text-white'>#ff0000</span>
            <span className='rounded border bg-[#00ff00] px-2 py-1 text-white'>#00ff00</span>
            <span className='rounded border bg-[#0000ff] px-2 py-1 text-white'>#0000ff</span>
          </div>
        </li>
      </ol>

      <p className='mt-4 text-sm text-gray-500'>
        💡 Mẹo: Bạn có thể kết hợp nhiều định dạng cùng lúc (ví dụ chữ vừa in đậm vừa gạch chân).
      </p>
    </div>
  )
}
