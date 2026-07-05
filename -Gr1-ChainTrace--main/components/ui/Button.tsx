import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  let styleClass = 'btn-primary';
  if (variant === 'secondary') styleClass = 'btn-secondary';
  if (variant === 'danger') styleClass = 'btn-danger';

  return (
    <button
      className={`${styleClass} ${className} relative`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="opacity-0">{children}</span>
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
