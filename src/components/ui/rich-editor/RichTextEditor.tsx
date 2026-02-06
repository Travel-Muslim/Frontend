import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Tulis konten artikel di sini...',
  className = '',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Masukkan URL gambar:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const formatHeading = (level: number) => {
    execCommand('formatBlock', `<h${level}>`);
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
  ];

  return (
    <div className={`border border-[#ffc9d6] rounded-[10px] bg-white ${isFocused ? 'border-[#ff8fb1] shadow-[0_0_0_1px_rgba(255,143,177,0.3)]' : ''} transition-all ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {/* Format buttons */}
        {toolbarButtons.map(({ icon: Icon, command, title }) => (
          <button
            key={command}
            type="button"
            onClick={() => execCommand(command)}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title={title}
          >
            <Icon className="w-4 h-4 text-gray-700" />
          </button>
        ))}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Heading buttons */}
        <button
          type="button"
          onClick={() => formatHeading(2)}
          className="px-3 py-1 hover:bg-gray-200 rounded text-sm font-semibold transition-colors"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => formatHeading(3)}
          className="px-3 py-1 hover:bg-gray-200 rounded text-sm font-semibold transition-colors"
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* List buttons */}
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4 text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link and Image buttons */}
        <button
          type="button"
          onClick={insertLink}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-h-[400px] p-4 outline-none prose prose-sm max-w-none"
        style={{
          fontFamily: 'sans-serif',
          fontSize: '1rem',
          lineHeight: '1.75',
          color: '#1f2937',
        }}
        suppressContentEditableWarning
      >
        {!value && !isFocused && (
          <div className="text-gray-400 pointer-events-none">{placeholder}</div>
        )}
      </div>

      {/* Custom styles for editor content */}
      <style>
        {`
          .prose p {
            margin-bottom: 1.25rem;
            text-align: justify;
          }
          .prose h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          .prose h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          .prose ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 1.25rem;
          }
          .prose ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin-bottom: 1.25rem;
          }
          .prose li {
            margin-bottom: 0.5rem;
          }
          .prose strong {
            font-weight: 600;
            color: #111827;
          }
          .prose em {
            font-style: italic;
            color: #6b7280;
          }
          .prose a {
            color: #9333ea;
            text-decoration: underline;
          }
          .prose a:hover {
            color: #7e22ce;
          }
          .prose img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1.5rem 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </div>
  );
}
