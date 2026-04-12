export type UploadPreset = {
  maxFiles: number;
  maxFileSizeMB: number;
  maxTotalSizeMB: number;
  allowedTypes: string[];
  compressImages?: boolean;
};

export type ValidationResult = {
  valid: boolean;
  error?: string;
  files: File[];
};
