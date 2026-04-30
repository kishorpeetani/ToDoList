export function Notification({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div className={`notification ${notification.type}`}>
      <p>{notification.message}</p>
      <button type="button" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}
