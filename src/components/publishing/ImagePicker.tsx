'use client';

import React from 'react';
import { Image as ImageIcon, X, Plus } from 'lucide-react';

export function ImagePicker() {
  const [images, setImages] = React.useState<string[]>([]);

  const addImage = () => {
    // Mock adding an image
    setImages([...images, `https://picsum.photos/seed/${Math.random()}/400/400`]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((src, index) => (
        <div key={index} className="aspect-square rounded-2xl overflow-hidden relative group border border-outline-variant/10 shadow-inner">
          <img src={src} alt={`Upload ${index}`} className="w-full h-full object-cover" />
          <button 
            onClick={() => removeImage(index)}
            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      {images.length < 5 && (
        <button 
          onClick={addImage}
          className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 text-on-surface-variant/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all group"
        >
          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
             <Plus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">إضافة صور</span>
        </button>
      )}
    </div>
  );
}
