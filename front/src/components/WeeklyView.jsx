import { useMemo } from "react";
import { BarChart3, Clock, CheckCircle, TrendingUp, AlertTriangle } from "lucide-react";

function WeeklyView({ entries = [] }) {
  const now = new Date();

  // Compute the last 7 days (including today)
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const dayEntries = entries.filter((e) => e.workDate === dateStr);
      let workedHours = 0;
      let shortHours = 0;
      let surplusHours = 0;

      dayEntries.forEach((e) => {
        workedHours += parseFloat(e.workedHours) || 0;
        shortHours += parseFloat(e.shortHours) || 0;
        surplusHours += parseFloat(e.surplusHours) || 0;
      });

      const targetHours = 8.67; // standard daily goal
      const percent = Math.min(100, Math.round((workedHours / targetHours) * 100));

      days.push({
        dateStr,
        dayName,
        monthDay,
        workedHours,
        shortHours,
        surplusHours,
        targetHours,
        percent,
      });
    }
    return days;
  }, [entries, now]);

  const totalWeekWorked = last7Days.reduce((acc, d) => acc + d.workedHours, 0);
  const activeDaysCount = last7Days.filter((d) => d.workedHours > 0).length;
  const avgDailyWorked = activeDaysCount > 0 ? (totalWeekWorked / activeDaysCount).toFixed(2) : "0.00";

  return (
    <div className="glass-card">
      <div className="card-title-row">
        <h2>
          <BarChart3 size={22} color="var(--primary-light)" />
          Weekly Productivity & Shift Progress (Last 7 Days)
        </h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span className="status-badge status-neutral">
            Avg: <strong>{avgDailyWorked}h / active day</strong>
          </span>
          <span className="status-badge status-surplus">
            Total: <strong>{totalWeekWorked.toFixed(2)}h</strong>
          </span>
        </div>
      </div>

      <div className="weekly-progress-grid">
        {last7Days.map((day) => {
          const isTargetMet = day.workedHours >= day.targetHours;
          const hasWorked = day.workedHours > 0;

          return (
            <div key={day.dateStr} className="weekly-day-row">
              <div className="weekly-day-label">
                <span style={{ fontWeight: 700 }}>{day.dayName}</span>{" "}
                <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{day.monthDay}</span>
              </div>

              <div className="weekly-bar-track">
                <div
                  className="weekly-bar-fill"
                  style={{
                    width: `${hasWorked ? Math.max(8, day.percent) : 0}%`,
                    background: isTargetMet
                      ? "linear-gradient(90deg, #10b981, #059669)"
                      : hasWorked
                      ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                      : "transparent",
                  }}
                />
              </div>

              <div className="weekly-day-hours">
                {hasWorked ? (
                  <span
                    style={{
                      color: isTargetMet ? "var(--success-text)" : "var(--text-main)",
                    }}
                  >
                    {day.workedHours.toFixed(2)}h
                  </span>
                ) : (
                  <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>0h</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyView;
