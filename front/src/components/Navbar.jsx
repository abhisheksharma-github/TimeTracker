import { useState, useEffect } from "react";
import { Clock, Sun, Moon, Bell, Calendar } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

function Navbar({ activeTimerSeconds, isTimerRunning, onTimerClick }) {
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotification();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Live Current Clock from User Device
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentDateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentDateTime.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formatTimerDigits = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <header className="navbar no-print">
      <div className="nav-brand">
        <div className="brand-icon">
          <Clock size={26} strokeWidth={2.4} />
        </div>
        <div>
          <div className="brand-title">TimeTracker</div>
          <div className="brand-subtitle">Smart Work Logging & Analytics</div>
        </div>
      </div>

      <div className="nav-actions">
        {/* Live Current Device Clock Badge */}
        <div
          className="current-time-pill"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--card-header-bg)",
            border: "1px solid var(--border-light)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--text-main)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
          title={`User Device Time: ${formattedDate} ${formattedTime}`}
        >
          <Clock size={15} color="var(--primary-light)" />
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{formattedDate}</span>
          <span style={{ color: "var(--border-light)" }}>|</span>
          <span className="mono-font" style={{ color: "var(--primary-light)", letterSpacing: "0.5px" }}>
            {formattedTime}
          </span>
        </div>

        {/* Live Active Stopwatch / Countdown Pill */}
        {activeTimerSeconds > 0 && (
          <button
            className={`timer-nav-pill ${isTimerRunning ? "active" : ""}`}
            onClick={onTimerClick}
            title="Jump to live timer"
          >
            {isTimerRunning && <span className="live-dot" />}
            <span className="mono-font">{formatTimerDigits(activeTimerSeconds)}</span>
          </button>
        )}

        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            className="btn-icon notification-bell-btn"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            aria-label="Toggle notifications"
            title="Notifications & Activity"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* Dark/Light Mode Switcher */}
        <button
          className="btn-icon"
          onClick={toggleTheme}
          aria-label="Toggle dark/light theme"
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
        >
          {isDark ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#6366f1" />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
