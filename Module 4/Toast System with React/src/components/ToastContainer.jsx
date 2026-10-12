export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => onDismiss(toast.id)}
          role="status"
          aria-live="polite"
          title="Click to dismiss"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
