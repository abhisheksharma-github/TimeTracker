import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ArrowRightCircle, Sparkles, Tag } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

function LiveTimer({ onApplyToForm, activeSeconds, setActiveSeconds, isRunning, setIsRunning }) {
  const { addNotification } = useNotification();
  const [taskName, setTaskName] = useState("");
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      if (!startTime) {
        setStartTime(new Date());
      }
      intervalRef.current = setInterval(() => {
        setActiveSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, setActiveSeconds, startTime]);

  const handleStart = () => {
    if (!startTime) {
      setStartTime(new Date());
    }
    setIsRunning(true);
    addNotification({
      title: "Timer Started",
      message: `Tracking session${taskName ? ` for "${taskName}"` : ""}`,
      type: "info",
      showAsToast: false,
    });
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveSeconds(0);
    setStartTime(null);
  };

  const formatDigits = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTransferToForm = () => {
    if (activeSeconds < 60) {
      addNotification({
        title: "Session Too Short",
        message: "Elapsed time is less than 1 minute. Let the timer run longer or log manually.",
        type: "warning",
      });
      return;
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    
    // Calculate inTime from now minus activeSeconds
    const calculatedStart = new Date(now.getTime() - activeSeconds * 1000);
    const inTimeStr = calculatedStart.toTimeString().slice(0, 5);
    const outTimeStr = now.toTimeString().slice(0, 5);

    onApplyToForm({
      workDate: todayStr,
      inTime: inTimeStr,
      outTime: outTimeStr,
      remarks: taskName || "Logged via Live Stopwatch",
    });

    addNotification({
      title: "Timer Logged",
      message: `Populated ${inTimeStr} to ${outTimeStr} (${formatDigits(activeSeconds)}) into form.`,
      type: "success",
    });

    handleReset();
  };

  const setPreset = (minutes, label) => {
    handleReset();
    setTaskName(label);
    setActiveSeconds(minutes * 60);
  };

  return (
    <div className="glass-card live-timer-card no-print" id="live-timer-section">
      <div className="card-title-row">
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
          <Sparkles size={20} color="var(--primary-light)" />
          Live Interactive Task Stopwatch
        </h2>
        <span
          className={`timer-state-badge ${
            isRunning ? "running" : activeSeconds > 0 ? "paused" : "idle"
          }`}
        >
          {isRunning ? "● Tracking Time" : activeSeconds > 0 ? "❚❚ Paused" : "○ Ready"}
        </span>
      </div>

      <div className="timer-display-container">
        <div className="timer-digits-box">
          <div className="timer-digits">{formatDigits(activeSeconds)}</div>
        </div>

        <div className="timer-inputs-bar">
          <div className="input-group" style={{ flex: 1 }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="What are you working on? (e.g. Backend API Optimization)"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                style={{ paddingLeft: "36px" }}
              />
              <Tag
                size={16}
                color="var(--text-muted)"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>
        </div>

        <div className="timer-actions">
          {!isRunning ? (
            <button className="btn btn-primary" onClick={handleStart}>
              <Play size={18} />
              Start
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handlePause}>
              <Pause size={18} />
              Pause
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={activeSeconds === 0}
            title="Reset timer"
          >
            <RotateCcw size={18} />
          </button>

          <button
            className="btn btn-primary"
            onClick={handleTransferToForm}
            disabled={activeSeconds < 60}
            style={{
              background: "linear-gradient(135deg, var(--success), #059669)",
              boxShadow: "0 4px 14px var(--success-glow)",
            }}
          >
            <ArrowRightCircle size={18} />
            Log to Entry
          </button>
        </div>
      </div>

      {/* Quick Sprint Presets */}
      <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
          Quick Presets:
        </span>
        <button
          type="button"
          className="preset-chip"
          onClick={() => setPreset(25, "Pomodoro Focus Sprint (25m)")}
        >
          ⏱️ 25m Pomodoro
        </button>
        <button
          type="button"
          className="preset-chip"
          onClick={() => setPreset(45, "Client Sync & Meeting (45m)")}
        >
          📅 45m Meeting
        </button>
        <button
          type="button"
          className="preset-chip"
          onClick={() => setPreset(60, "Deep Architecture Coding (1h)")}
        >
          🚀 1h Deep Work
        </button>
      </div>
    </div>
  );
}

export default LiveTimer;
