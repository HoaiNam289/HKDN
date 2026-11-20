import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      rightIcon,
      onRightIconClick,
      helperText,
      id,
      className = '',
      disabled,
      required,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none transition-colors">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed ${
              icon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
            } ${className}`}
            {...rest}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {onRightIconClick ? (
                <button
                  type="button"
                  onClick={onRightIconClick}
                  disabled={disabled}
                  tabIndex={-1}
                  aria-label="Thao tác bổ sung"
                  className="text-slate-400 hover:text-slate-600 focus:text-blue-600 transition-colors p-0.5 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {rightIcon}
                </button>
              ) : (
                <span className="text-slate-400 pointer-events-none flex items-center justify-center">
                  {rightIcon}
                </span>
              )}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
