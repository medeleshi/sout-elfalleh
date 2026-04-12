export const UPLOAD_MESSAGES = {
  invalidPreset: "إعدادات المصادقة غير صالحة.",
  tooManyFiles: (max: number) => `التجاوز: لا يسمح بأكثر من ${max} صور.`,
  unsupportedType: (filename: string) => `نوع الملف غير مدعوم: ${filename}. المدعوم: JPEG, PNG, WEBP`,
  fileTooLarge: (filename: string, sizeMB: number, maxMB: number) => 
    `حجم الملف ${filename} يبلغ (${sizeMB.toFixed(1)}MB) ويتجاوز الحد الأقصى (${maxMB}MB).`,
  totalSizeTooLarge: (maxMB: number) => 
    `إجمالي حجم الصور يتجاوز سعة النقل الأقصى (${maxMB}MB).`,
};
