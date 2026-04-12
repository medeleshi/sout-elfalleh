import { UPLOAD_PRESETS } from './presets';
import { UPLOAD_MESSAGES } from './messages';
import { ValidationResult } from './types';

export function validateUpload(files: File[], presetName: keyof typeof UPLOAD_PRESETS): ValidationResult {
  const preset = UPLOAD_PRESETS[presetName];
  if (!preset) throw new Error(UPLOAD_MESSAGES.invalidPreset);

  const realFiles = files.filter(f => f && f.size > 0);
  if (realFiles.length === 0) return { valid: true, files: [] };

  if (realFiles.length > preset.maxFiles) {
    return { valid: false, error: UPLOAD_MESSAGES.tooManyFiles(preset.maxFiles), files: [] };
  }

  let totalSize = 0;
  for (const file of realFiles) {
    // Note: Due to 'satisfies Record<string, UploadPreset>', allowedTypes is automatically narrowed securely
    if (!preset.allowedTypes.includes(file.type)) {
       return { valid: false, error: UPLOAD_MESSAGES.unsupportedType(file.name), files: [] };
    }
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > preset.maxFileSizeMB) {
       return { valid: false, error: UPLOAD_MESSAGES.fileTooLarge(file.name, fileSizeMB, preset.maxFileSizeMB), files: [] };
    }
    totalSize += fileSizeMB;
  }

  if (totalSize > preset.maxTotalSizeMB) {
     return { valid: false, error: UPLOAD_MESSAGES.totalSizeTooLarge(preset.maxTotalSizeMB), files: [] };
  }

  return { valid: true, files: realFiles };
}
