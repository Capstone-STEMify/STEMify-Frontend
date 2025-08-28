// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

// Giả sử bạn đã cập nhật TiptapEditor để nhận prop onChange
const TiptapEditor = dynamic(() => import('@/components/tiptap/TiptapEditor'), { ssr: false });


export default function Home() {
  const [content, setContent] = useState<string>('');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const showContent = () => {
    console.log(content); 
    alert("Nội dung đã được log ra console!");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Tiptap with Next.js</h1>
      <div className="w-full max-w-4xl border rounded-lg">
        <TiptapEditor onChange={handleContentChange} />
      </div>
      <button onClick={showContent} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
        Lấy nội dung HTML
      </button>
    </main>
  );
}