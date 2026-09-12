import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, X, Info } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function CalendarView({ entries = [], selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }) {
  const [selectedDayEntries, setSelectedDayEntries] = useState(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState("");

  const now = new Date();
  const currentMonth = selectedMonth ?? (now.getMonth() + 1);
  const currentYear = selectedYear ?? now.getFullYear();

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(currentYear - 1);
    } else {
      setSelectedMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(currentYear + 1);
    } else {
      setSelectedMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
  };

  // Build calendar matrix
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Leading empty/outside days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, isOutside: true });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayEntries = entries.filter((e) => e.workDate === dateStr);

      let totalWorked = 0;
      let totalShort = 0;
      let totalSurplus = 0;

      dayEntries.forEach((e) => {
        totalWorked += parseFloat(e.workedHours) || 0;
        totalShort += parseFloat(e.shortHours) || 0;
        totalSurplus += parseFloat(e.surplusHours) || 0;
      });

      const dayOfWeek = new Date(currentYear, currentMonth - 1, d).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday =
        now.getFullYear() === currentYear &&
        now.getMonth() + 1 === currentMonth &&
        now.getDate() === d;

      days.push({
        dayNumber: d,
        dateStr,
        isOutside: false,
        isWeekend,
        isToday,
        entries: dayEntries,
        totalWorked: totalWorked > 0 ? totalWorked.toFixed(2) : null,
        totalShort: totalShort > 0 ? totalShort.toFixed(2) : null,
        totalSurplus: totalSurplus > 0 ? totalSurplus.toFixed(2) : null,
      });
    }

    return days;
  }, [currentYear, currentMonth, entries, now]);

  const handleDayClick = (day) => {
    if (day.isOutside || !day.dayNumber) return;
    setSelectedDateLabel(`${MONTH_NAMES[currentMonth - 1]} ${day.dayNumber}, ${currentYear}`);
    setSelectedDayEntries(day.entries);
  };

  return (
    <div className="glass-card">
      {/* Calendar Header Toolbar */}
      <div className="calendar-header no-print">
        <div className="calendar-month-title">
          <CalendarIcon size={24} color="var(--primary-light)" />
          <span>
            {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button className="btn btn-secondary btn-sm" onClick={handleToday}>
            Today
          </button>
          <button className="btn-icon" onClick={handlePrevMonth} title="Previous Month">
            <ChevronLeft size={18} />
          </button>
          <button className="btn-icon" onClick={handleNextMonth} title="Next Month">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day headers */}
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="calendar-day-header">
            {wd}
          </div>
        ))}

        {/* Calendar Day Cells */}
        {calendarDays.map((day, idx) => {
          if (day.isOutside) {
            return <div key={`empty-${idx}`} className="calendar-day-cell outside-month" />;
          }

          const hasLog = day.entries.length > 0;
          const isSurplus = parseFloat(day.totalSurplus) > 0;
          const isShort = parseFloat(day.totalShort) > 0;

          return (
            <div
              key={`day-${day.dayNumber}`}
              className={`calendar-day-cell ${day.isToday ? "today" : ""}`}
              onClick={() => handleDayClick(day)}
              title={`${day.dateStr} - Click for details`}
            >
              <div className="day-number">
                <span style={{ color: day.isWeekend ? "var(--text-dim)" : "var(--text-main)" }}>
                  {day.dayNumber}
                </span>
                {day.isToday && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      background: "var(--primary)",
                      color: "#fff",
                      padding: "1px 6px",
                      borderRadius: "8px",
                    }}
                  >
                    TODAY
                  </span>
                )}
              </div>

              {hasLog ? (
                <div
                  className={`day-status-pill ${
                    isSurplus ? "status-surplus" : isShort ? "status-short" : "status-met"
                  }`}
                >
                  {day.totalWorked}h
                </div>
              ) : (
                <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: "4px" }}>
                  {day.isWeekend ? "Off" : "No entry"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Day Details Modal Popup */}
      {selectedDayEntries && (
        <div className="modal-backdrop" onClick={() => setSelectedDayEntries(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-title-row">
              <h2>
                <CalendarIcon size={22} color="var(--primary-light)" />
                {selectedDateLabel} Details
              </h2>
              <button
                className="btn-icon"
                onClick={() => setSelectedDayEntries(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {selectedDayEntries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)" }}>
                <Info size={32} style={{ opacity: 0.5, marginBottom: "8px" }} />
                <p>No work hours were logged for this day.</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Time In</th>
                      <th>Time Out</th>
                      <th>Worked</th>
                      <th>Short</th>
                      <th>Surplus</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDayEntries.map((e, index) => (
                      <tr key={index}>
                        <td className="mono-font">{e.inTime}</td>
                        <td className="mono-font">{e.outTime}</td>
                        <td className="mono-font" style={{ fontWeight: 700 }}>
                          {e.workedHours}h
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              parseFloat(e.shortHours) > 0 ? "status-short" : "status-neutral"
                            }`}
                          >
                            {e.shortHours}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              parseFloat(e.surplusHours) > 0 ? "status-surplus" : "status-neutral"
                            }`}
                          >
                            {e.surplusHours}
                          </span>
                        </td>
                        <td>{e.remarks || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;
