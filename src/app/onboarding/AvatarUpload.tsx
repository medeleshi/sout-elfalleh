'use client';

import React, { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Camera, Pencil, Loader2, ImagePlus } from "lucide-react";

interface AvatarUploadProps {
  userId: string;
  onUploadComplete: (url: string) => void;
  initialUrl?: string;
}

export function AvatarUpload({ userId, onUploadComplete, initialUrl }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initialUrl || "");
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
    } catch (error: any) {
      alert(error.message || 'فشل تحميل الصورة.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-label-large text-primary/80">
        <Camera className="w-4 h-4" />
        صورة الملف الشخصي
        <span className="text-[10px] text-on-surface-variant/60 font-normal">(اختياري)</span>
      </label>

      <div
        onClick={() => fileRef.current?.click()}
        className="flex flex-col items-center gap-5 p-8 bg-surface-container rounded-3xl border-2 border-dashed border-outline-variant hover:border-primary hover:bg-surface-container-high transition-all cursor-pointer group relative overflow-hidden"
      >
        {/* Avatar circle */}
        <div className="relative z-10">
          <div className="w-28 h-28 rounded-full bg-surface flex items-center justify-center overflow-hidden border-4 border-surface shadow-xl transition-transform group-hover:scale-105">
            {preview ? (
              <img src={preview} alt="صورة الملف" className="w-full h-full object-cover" />
            ) : (
              <ImagePlus className="w-12 h-12 text-primary/30 group-hover:text-primary transition-colors" />
            )}
          </div>
          {/* Edit badge */}
          <div className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg border-4 border-surface group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
            {uploading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Pencil className="w-3.5 h-3.5" />
            }
          </div>
        </div>

        {/* Text */}
        <div className="text-center relative z-10">
          <p className="text-title-md text-on-surface mb-1">
            {uploading ? 'جاري التحميل...' : 'اضغط لاختيار صورة'}
          </p>
          <p className="text-body-sm text-on-surface-variant/60">
            PNG, JPG — حتى 5 ميجابايت
          </p>
        </div>

        <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      <input
        type="file"
        ref={fileRef}
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  );
}
