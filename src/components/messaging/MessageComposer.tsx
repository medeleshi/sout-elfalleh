'use client';

import React from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';

interface MessageComposerProps {
  onSend: (text: string) => void;
  onAttachImage?: () => void;
  placeholder?: string;
}

export function MessageComposer({ onSend, onAttachImage, placeholder = "اكتب رسالتك هنا..." }: MessageComposerProps) {
  const [text, setText] = React.useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="p-3 lg:p-6 bg-white/80 backdrop-blur border-t border-outline-variant/10">
      <div className="flex items-end gap-2 lg:gap-3 max-w-5xl mx-auto">
        <button 
          onClick={onAttachImage}
          className="p-3 lg:p-4 bg-surface-container-low rounded-xl lg:rounded-2xl text-on-surface-variant/40 hover:text-primary active:scale-95 transition-all shadow-sm"
          aria-label="Attach image"
        >
          <ImageIcon className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        <div className="flex-1 relative">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder} 
            rows={1}
            className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl lg:rounded-[1.5rem] px-4 lg:px-6 py-3 lg:py-4 text-[13px] lg:text-sm font-medium outline-none transition-all resize-none max-h-32 shadow-inner"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>
        <button 
          onClick={handleSend}
          className="p-3 lg:p-4 bg-primary text-on-primary rounded-xl lg:rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
          disabled={!text.trim()}
          aria-label="Send message"
        >
          <Send className="w-5 h-5 lg:w-6 lg:h-6 rotate-180" />
        </button>
      </div>
    </div>
  );
}
