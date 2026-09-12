import { useNotification } from "../context/NotificationContext";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} color="var(--success)" />;
      case "error":
        return <AlertCircle size={18} color="var(--error)" />;
      case "warning":
        return <AlertTriangle size={18} color="var(--warning)" />;
      default:
        return <Info size={18} color="var(--primary-light)" />;
    }
  };

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div className="toast-content">
            {getIcon(toast.type)}
            <span>{toast.message}</span>
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
