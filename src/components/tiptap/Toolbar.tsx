'use client';

import { type Editor } from '@tiptap/react';
import {
  Bold, Italic, Strikethrough, Code, Underline, Link as LinkIcon,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Quote, Image, Undo, Redo, Eraser,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Subscript as SubIcon, Superscript as SuperIcon
} from 'lucide-react';
import { useState, useCallback, useRef, ChangeEvent } from 'react';

type Props = {
  editor: Editor | null;
};

const ToolbarButton = ({ onClick, isActive, children, disabled }: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-md transition-colors duration-200 
                ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

export const Toolbar = ({ editor }: Props) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (!editor || !event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  }, [editor]);

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const setLink = useCallback(() => {
    if (!editor) return;
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      setShowLinkInput(false);
      setUrl('');
      return;
    }
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      setShowLinkInput(false);
      setUrl('');
    }
  }, [editor, url]);

  if (!editor) {
    return (
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 h-[48px] animate-pulse bg-gray-100 dark:bg-gray-800 rounded-t-lg"></div>
    );
  }

  return (
    <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-center gap-1 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo className="w-4 h-4" /></ToolbarButton>
      
      <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>

      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}><Heading1 className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}><Heading2 className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}><Heading3 className="w-4 h-4" /></ToolbarButton>

      <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>

      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}><Bold className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}><Italic className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}><Underline className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}><Strikethrough className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')}><Code className="w-4 h-4" /></ToolbarButton>

      <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>

      <ToolbarButton onClick={handleImageClick}><Image className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => setShowLinkInput(!showLinkInput)} isActive={editor.isActive('link')}><LinkIcon className="w-4 h-4" /></ToolbarButton>
      {showLinkInput && (
        <div className="flex items-center gap-1 ml-2">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setLink()} placeholder="https://example.com" className="border rounded-md px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <ToolbarButton onClick={setLink}>Lưu</ToolbarButton>
        </div>
      )}

      <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')}><SuperIcon className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')}><SubIcon className="w-4 h-4" /></ToolbarButton>
      
      <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>
      
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}><AlignLeft className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}><AlignCenter className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}><AlignRight className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })}><AlignJustify className="w-4 h-4" /></ToolbarButton>

      <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}><List className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}><ListOrdered className="w-4 h-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}><Quote className="w-4 h-4" /></ToolbarButton>
      
      <span className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></span>

      <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><Eraser className="w-4 h-4" /></ToolbarButton>
    </div>
  );
};