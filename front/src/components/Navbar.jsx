import { useState } from "react";
import { Clock, Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

function Navbar({ activeTimerSeconds, isTimerRunning, onTimerClick }) {
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotification();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const formatTimerDigits = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <header className="navbar no-print">
      <div className="nav-brand">
        <div className="brand-icon">
          <Clock size={26} strokeWidth={2.4} />
        </div>
        <div>
          <div className="brand-title">TimeTracker</div>
          <div className="brand-subtitle">Smart Full-Stack Work Logging & Analytics</div>
        </div>
      </div>

      <div className="nav-actions">
        {/* Live Active Timer Pill */}
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
