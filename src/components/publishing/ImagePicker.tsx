'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { validateUpload } from '@/lib/uploads/validate-files';
import { UPLOAD_PRESETS } from '@/lib/uploads/presets';

interface ImagePickerProps {
  existingImages?: string[];
  onChange?: (files: File[]) => void;
  onRemoveExisting?: (index: number) => void;
  presetName?: keyof typeof UPLOAD_PRESETS;
}

export function ImagePicker({ existingImages = [], onChange, onRemoveExisting, presetName = 'listing' }: ImagePickerProps) {
  const [previews, setPreviews] = useState<{ src: string, isFile: boolean, file?: File }[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Populate initial existing images
    setPreviews(existingImages.map(src => ({ src, isFile: false })));
  }, [JSON.stringify(existingImages)]);

  // Sync previews to the native input element so FormData accurately captures all files
  const syncNativeInput = (currentPreviews: { isFile: boolean, file?: File }[]) => {
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    currentPreviews.forEach(p => {
      if (p.isFile && p.file) {
        dt.items.add(p.file);
      }
    });
    fileInputRef.current.files = dt.files;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalError(null);
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    
    // Evaluate combined new files payload against the preset
    const combinedFiles = [...previews.filter(p => p.isFile).map(p => p.file as File), ...newFiles];
    const validation = validateUpload(combinedFiles, presetName);
    
    if (!validation.valid) {
      setLocalError(validation.error || 'حدث خطأ في الملفات');
      // Must detach the bad payload from the native input to prevent silent form pushes
      syncNativeInput(previews); 
      return;
    }

    const newPreviews = newFiles.map(f => ({ src: URL.createObjectURL(f), isFile: true, file: f }));
    
    setPreviews(prev => {
      const combined = [...prev, ...newPreviews];
      syncNativeInput(combined);
      return combined;
    });

    if (onChange) {
      onChange(validation.files);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => {
      const target = prev[index];
      if (!target.isFile && onRemoveExisting) {
        onRemoveExisting(index);
      }
      const updated = prev.filter((_, i) => i !== index);
      syncNativeInput(updated);
      return updated;
    });
  };

  const maxAllowed = UPLOAD_PRESETS[presetName].maxFiles;

  return (
    <div className="space-y-4">
      {localError && (
        <div className="bg-error/5 border border-error/20 rounded-xl p-3 flex items-center gap-2 text-error text-xs font-black">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{localError}</span>
        </div>
      )}
      <input 
        type="file" 
        name="images" 
        multiple 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {/* Hidden input to pass back the retained existing images to the server action during updates */}
      <input 
        type="hidden" 
        name="retained_images" 
        value={JSON.stringify(previews.filter(p => !p.isFile).map(p => p.src))}
      />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="aspect-square rounded-2xl overflow-hidden relative group border border-outline-variant/10 shadow-inner">
            <img src={preview.src.startsWith('http') || preview.src.startsWith('blob') ? preview.src : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${preview.src}`} alt={`Upload ${index}`} className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {previews.length < maxAllowed && (
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 text-on-surface-variant/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all group"
          >
            <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
               <Plus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{previews.length > 0 ? 'إضافة المزيد' : 'إضافة صور'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
