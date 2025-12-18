import { useState, useEffect, useCallback } from 'react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'pink';

type ToastProps = {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
  title?: string;
};

export function Toast({
  id,
  message,
  variant = 'info',
  duration = 3000,
  onClose,
  title,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(id);
    }, 300);
  }, [id, onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  // Define variant-specific styles
  const variantStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      closeBg: 'bg-green-100 hover:bg-green-200'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      closeBg: 'bg-red-100 hover:bg-red-200'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: 'text-amber-600',
      closeBg: 'bg-amber-100 hover:bg-amber-200'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      closeBg: 'bg-blue-100 hover:bg-blue-200'
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-800',
      icon: 'text-pink-600',
      closeBg: 'bg-pink-100 hover:bg-pink-200'
    },
  };

  const { bg, border, text, icon, closeBg } = variantStyles[variant];

  const iconMap = {
    success: (
      <svg
        className={`w-5 h-5 ${icon}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    ),
    error: (
      <svg
        className={`w-5 h-5 ${icon}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    ),
    warning: (
      <svg
        className={`w-5 h-5 ${icon}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        ></path>
      </svg>
    ),
    info: (
      <svg
        className={`w-5 h-5 ${icon}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    ),
    pink: (
      <svg
        className={`w-5 h-5 ${icon}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    ),
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${bg} ${border} border rounded-lg shadow-lg p-4 flex items-start
        max-w-xs w-full
        sm:max-w-sm
        md:max-w-md
      `}
    >
      {iconMap[variant]}
      <div className="ml-3 flex-1">
        {title && <p className={`font-semibold text-sm ${text}`}>{title}</p>}
        <p className={`text-sm mt-1 ${text}`}>{message}</p>
      </div>
      <button
        type="button"
        className={`ml-4 ${closeBg} rounded-full p-1.5 flex items-center justify-center transition-colors duration-200`}
        onClick={handleClose}
        aria-label="Close toast"
      >
        <svg
          className={`${text} w-4 h-4`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  );
}

export type ToastItem = {
  id: string;
  message: string;
  variant?: ToastVariant;
  title?: string;
};

type ToastContainerProps = {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end gap-3 w-full max-w-xs px-4 sm:max-w-sm md:max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          variant={toast.variant}
          title={toast.title}
          onClose={onRemove}
        />
      ))}
    </div>
  );
}
