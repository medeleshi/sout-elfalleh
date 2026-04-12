import { UploadPreset } from './types';

export const UPLOAD_PRESETS = {
  listing: {
    maxFiles: 5,
    maxFileSizeMB: 4,
    maxTotalSizeMB: 15,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    compressImages: true,
  },
  post: {
    maxFiles: 3,
    maxFileSizeMB: 3,
    maxTotalSizeMB: 8,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    compressImages: true,
  },
  avatar: {
    maxFiles: 1,
    maxFileSizeMB: 2,
    maxTotalSizeMB: 2,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    compressImages: true,
  }
} satisfies Record<string, UploadPreset>;
