import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ArrowRightCircle, Sparkles, Tag, Timer, Clock } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

function LiveTimer({ onApplyToForm, activeSeconds, setActiveSeconds, isRunning, setIsRunning }) {
  const { addNotification } = useNotification();
  const [taskName, setTaskName] = useState("");
  const [timerMode, setTimerMode] = useState("stopwatch"); // 'stopwatch' (count up) | 'countdown' (count down)
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      if (!startTime) {
        setStartTime(new Date());
      }

      intervalRef.current = setInterval(() => {
        if (timerMode === "countdown") {
          setActiveSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setIsRunning(false);
              addNotification({
                title: "⏳ Countdown Finished!",
                message: `Session for "${taskName || "Focus Task"}" is complete! Ready to log.`,
                type: "success",
              });
              return 0;
            }
            return prev - 1;
          });
        } else {
          setActiveSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timerMode, setActiveSeconds, setIsRunning, startTime, taskName, addNotification]);

  const handleStart = () => {
    if (!startTime) {
      setStartTime(new Date());
    }
    setIsRunning(true);
    addNotification({
      title: timerMode === "countdown" ? "Countdown Started" : "Stopwatch Started",
      message: `${timerMode === "countdown" ? "Counting backward" : "Tracking time"} for "${taskName || "Active Task"}"`,
      type: "info",
      showAsToast: false,
    });
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === "countdown" && totalDurationSeconds > 0) {
      setActiveSeconds(totalDurationSeconds);
    } else {
      setActiveSeconds(0);
      setTimerMode("stopwatch");
      setTotalDurationSeconds(0);
    }
    setStartTime(null);
  };

  const formatDigits = (totalSec) => {
    const s = Math.max(0, totalSec);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleTransferToForm = () => {
    let elapsedSeconds = activeSeconds;

    if (timerMode === "countdown") {
      elapsedSeconds = totalDurationSeconds - activeSeconds;
      if (elapsedSeconds <= 0 && activeSeconds === 0) {
        elapsedSeconds = totalDurationSeconds; // Full completed countdown
      }
    }

    if (elapsedSeconds < 30) {
      addNotification({
        title: "Session Too Short",
        message: "Elapsed time is less than 30 seconds. Let the timer run longer or log manually.",
        type: "warning",
      });
      return;
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const calculatedStart = new Date(now.getTime() - elapsedSeconds * 1000);
    const inTimeStr = calculatedStart.toTimeString().slice(0, 5);
    const outTimeStr = now.toTimeString().slice(0, 5);

    onApplyToForm({
      workDate: todayStr,
      inTime: inTimeStr,
      outTime: outTimeStr,
      remarks: taskName || (timerMode === "countdown" ? `Completed ${Math.round(totalDurationSeconds / 60)}m Focus Sprint` : "Logged via Live Stopwatch"),
    });

    addNotification({
      title: "Session Logged",
      message: `Populated ${inTimeStr} to ${outTimeStr} (${formatDigits(elapsedSeconds)}) into form.`,
      type: "success",
    });

    handleReset();
  };

  // Preset triggers backward countdown mode
  const setCountdownPreset = (minutes, label) => {
    const durationSec = minutes * 60;
    setIsRunning(false);
    setTimerMode("countdown");
    setTaskName(label);
    setTotalDurationSeconds(durationSec);
    setActiveSeconds(durationSec);
    setStartTime(null);

    addNotification({
      title: "⏳ Countdown Preset Ready",
      message: `${minutes} minutes set for "${label}". Click Start to begin counting down.`,
      type: "info",
      showAsToast: false,
    });
  };

  const switchToStopwatch = () => {
    setIsRunning(false);
    setTimerMode("stopwatch");
    setActiveSeconds(0);
    setTotalDurationSeconds(0);
    setStartTime(null);
  };

  // Calculate percentage remaining for visual countdown progress bar
  const countdownPercent =
    timerMode === "countdown" && totalDurationSeconds > 0
      ? Math.max(0, Math.min(100, (activeSeconds / totalDurationSeconds) * 100))
      : 100;

  return (
    <div className="glass-card live-timer-card no-print" id="live-timer-section">
      <div className="card-title-row">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            {timerMode === "countdown" ? (
              <Timer size={22} color="var(--primary-light)" />
            ) : (
              <Clock size={22} color="var(--primary-light)" />
            )}
            {timerMode === "countdown" ? "Backward Countdown Timer" : "Live Task Stopwatch"}
          </h2>

          <span
            className={`timer-state-badge ${
              isRunning ? "running" : activeSeconds > 0 ? "paused" : "idle"
            }`}
          >
            {isRunning
              ? timerMode === "countdown"
                ? "⏳ Counting Down"
                : "● Tracking Time"
              : activeSeconds > 0
              ? "❚❚ Paused"
              : "○ Ready"}
          </span>
        </div>

        {/* Mode Switcher Button */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className={`btn-sm ${timerMode === "stopwatch" ? "btn-primary" : "btn-secondary"}`}
            onClick={switchToStopwatch}
            style={{ borderRadius: "8px", padding: "4px 10px", fontSize: "0.78rem" }}
          >
            Count Up
          </button>
          <button
            type="button"
            className={`btn-sm ${timerMode === "countdown" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setCountdownPreset(25, "Pomodoro Focus Sprint")}
            style={{ borderRadius: "8px", padding: "4px 10px", fontSize: "0.78rem" }}
          >
            Count Down
          </button>
        </div>
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
                placeholder={timerMode === "countdown" ? "Session goal (e.g. Finish Sprint Task)" : "What are you working on?"}
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
            <button className="btn btn-primary btn-main-action" onClick={handleStart}>
              <Play size={17} />
              <span>Start</span>
            </button>
          ) : (
            <button className="btn btn-secondary btn-main-action" onClick={handlePause}>
              <Pause size={17} />
              <span>Pause</span>
            </button>
          )}

          <button
            className="btn btn-secondary btn-reset-action"
            onClick={handleReset}
            disabled={activeSeconds === 0 && !isRunning}
            title="Reset timer"
          >
            <RotateCcw size={17} />
          </button>

          <button
            className="btn btn-primary btn-log-action"
            onClick={handleTransferToForm}
            disabled={
              timerMode === "countdown"
                ? totalDurationSeconds - activeSeconds < 30 && activeSeconds !== 0
                : activeSeconds < 30
            }
            style={{
              background: "linear-gradient(135deg, var(--success), #059669)",
              boxShadow: "0 4px 14px var(--success-glow)",
            }}
          >
            <ArrowRightCircle size={17} />
            <span>Log to Entry</span>
          </button>
        </div>
      </div>

      {/* Countdown Progress Bar (Visible in Countdown mode) */}
      {timerMode === "countdown" && totalDurationSeconds > 0 && (
        <div style={{ marginTop: "12px" }}>
          <div
            style={{
              height: "5px",
              background: "var(--card-header-bg)",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid var(--border-light)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${countdownPercent}%`,
                background: "linear-gradient(90deg, var(--primary), var(--secondary))",
                transition: "width 1s linear",
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Backward Countdown Presets */}
      <div className="timer-presets-container">
        <span className="timer-presets-label">
          ⏳ Presets:
        </span>
        <div className="timer-presets-row">
          <button
            type="button"
            className="preset-chip"
            onClick={() => setCountdownPreset(25, "Pomodoro Focus Sprint (25m)")}
          >
            ⏱️ 25m Pomodoro
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => setCountdownPreset(45, "Client Sync & Meeting (45m)")}
          >
            📅 45m Meeting
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => setCountdownPreset(60, "Deep Architecture Coding (1h)")}
          >
            🚀 1h Deep Work
          </button>
        </div>
      </div>
    </div>
  );
}

export default LiveTimer;
