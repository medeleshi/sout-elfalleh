'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({ 
  label, 
  hint, 
  error, 
  children, 
  required 
}: FormFieldProps) {
  return (
    <div className="space-y-2 lg:space-y-3 group/field">
      <div className="flex flex-col gap-1 px-1">
        <label className="text-sm lg:text-base font-black text-on-surface flex items-center gap-1.5 transition-colors group-focus-within/field:text-primary leading-none">
          {label}
          {required && <span className="text-primary">*</span>}
        </label>
        {hint && (
          <p className="text-[10px] lg:text-[11px] font-medium text-on-surface-variant/40 leading-relaxed italic pr-1">
            {hint}
          </p>
        )}
      </div>
      
      <div className="relative">
        {children}
      </div>

      {error && (
        <p className="text-[10px] font-black text-error px-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
