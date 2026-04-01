import React from 'react';

type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface FeedbackProps {
  type: FeedbackType;
  message: string;
  className?: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ type, message, className = '' }) => {
  const styles = {
    success: 'bg-[#F0F7EE] border-[#8BAA81] text-[#154212]',
    error: 'bg-[#FFF2F0] border-[#D1A096] text-[#9C331F]',
    warning: 'bg-[#FFF9EA] border-[#E8CBA5] text-[#825500]',
    info: 'bg-[#F4F8FA] border-[#A8BCC9] text-[#446173]',
  };

  const icons = {
    success: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all animate-in fade-in duration-500 shadow-sm ${styles[type]} ${className}`} role="alert">
      <div className="mt-0.5 opacity-90">{icons[type]}</div>
      <p className="text-lg font-black leading-snug">{message}</p>
    </div>
  );
};
