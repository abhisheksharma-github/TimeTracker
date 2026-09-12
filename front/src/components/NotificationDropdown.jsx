import { useRef, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, CheckCheck, Trash2 } from "lucide-react";

function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, markAllAsRead, markAsRead, clearNotifications } = useNotification();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={16} color="var(--success)" />;
      case "error":
        return <AlertCircle size={16} color="var(--error)" />;
      case "warning":
        return <AlertTriangle size={16} color="var(--warning)" />;
      default:
        return <Info size={16} color="var(--primary-light)" />;
    }
  };

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " · " + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return "";
    }
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '0.98rem', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>Activity & Alerts</h3>
          <span className="status-badge status-neutral" style={{ fontSize: '0.72rem' }}>
            {notifications.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-icon"
            style={{ padding: '6px', fontSize: '0.78rem' }}
            onClick={markAllAsRead}
            title="Mark all as read"
          >
            <CheckCheck size={14} />
          </button>
          <button
            className="btn-icon"
            style={{ padding: '6px', fontSize: '0.78rem' }}
            onClick={clearNotifications}
            title="Clear all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.88rem' }}>No recent notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${!n.read ? "unread" : ""}`}
              onClick={() => markAsRead(n.id)}
            >
              <div style={{ marginTop: '2px' }}>{getIcon(n.type)}</div>
              <div className="notification-item-content" style={{ flex: 1 }}>
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <span className="notification-time">{formatTime(n.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;
