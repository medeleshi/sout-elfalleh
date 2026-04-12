'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Zap,
  Tag
} from 'lucide-react';

interface ListingGalleryProps {
  images: string[];
  title: string;
  isFresh?: boolean;
}

export function ListingGallery({ images, title, isFresh }: ListingGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-surface-container-low rounded-[2.5rem] flex flex-col items-center justify-center gap-4 border-2 border-outline-variant/30">
        <Tag className="w-16 h-16 text-on-surface-variant/20" />
        <p className="text-sm font-black text-on-surface-variant/30 uppercase tracking-widest">لا توجد صور لهذا العرض</p>
      </div>
    );
  }

  const getImageUrl = (path: string) => {
    if (path.startsWith('http') || path.startsWith('blob')) return path;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${path}`;
  };

  return (
    <section className="relative rounded-[2.5rem] overflow-hidden bg-surface-container-low border-2 border-outline-variant/30 group">
      <div className="aspect-[16/10] overflow-hidden relative">
        <img 
          src={getImageUrl(images[currentIndex])} 
          className="w-full h-full object-cover transition-all duration-700 hover:scale-[1.02]" 
          alt={`${title} - ${currentIndex + 1}`}
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="w-full h-full hidden flex-col items-center justify-center gap-3 bg-surface-container-low text-on-surface-variant/30">
          <Tag className="w-12 h-12" />
          <span className="text-xs font-black uppercase tracking-widest">تعذر تحميل الصورة</span>
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      
      {/* Gallery Controls Overlay */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button 
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`الصورة ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`} 
            />
          ))}
        </div>
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
          <Search className="w-3 h-3" />
          <span>{currentIndex + 1} / {images.length} صورة</span>
        </div>
      </div>

      {/* Action Badges Over Media */}
      {isFresh && (
        <div className="absolute top-6 right-6 bg-primary text-on-primary px-5 py-2 rounded-full text-xs font-black shadow-2xl flex items-center gap-2">
          <Zap className="w-4 h-4 fill-current" />
          <span>جديد</span>
        </div>
      )}
    </section>
  );
}
