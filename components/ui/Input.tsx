import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const baseClasses = 'rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500';
    const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
    const widthClass = fullWidth ? 'w-full' : '';
    
    const inputClasses = `${baseClasses} ${errorClasses} ${widthClass} ${className}`;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
