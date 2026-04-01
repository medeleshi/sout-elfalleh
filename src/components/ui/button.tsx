import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'w-full py-5 rounded-2xl font-black text-xl transition-all transform flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary/95 hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-secondary text-on-secondary hover:bg-secondary/95 hover:shadow-xl hover:-translate-y-0.5',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'text-primary hover:bg-primary/5',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${isDisabled ? 'opacity-50 grayscale-[0.3] cursor-not-allowed transform-none shadow-none' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="opacity-80">جاري التحميل...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
