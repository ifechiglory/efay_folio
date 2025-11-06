// src/components/ui/Toast.jsx
import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

const Toast = () => {
  const { toasts, removeToast } = useUIStore();

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.autoHide) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle : XCircle;
        const bgColor = toast.type === 'success' 
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
        
        const textColor = toast.type === 'success'
          ? 'text-green-800 dark:text-green-300'
          : 'text-red-800 dark:text-red-300';

        return (
          <div
            key={toast.id}
            className={`flex items-center space-x-3 p-4 border rounded-lg shadow-lg ${bgColor} max-w-sm`}
          >
            <Icon className={`w-5 h-5 ${textColor}`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${textColor}`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;