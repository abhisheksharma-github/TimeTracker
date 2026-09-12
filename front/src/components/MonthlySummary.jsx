import { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, AlertCircle, CheckCircle, TrendingUp, Download, Printer, Calendar } from "lucide-react";
import { exportToCSV, triggerPrint } from "../utils/exportUtils";
import { useNotification } from "../context/NotificationContext";
import { formatMinutes } from "../utils/timeFormatUtils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function MonthlySummary({ refreshKey, entries = [], selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const now = new Date();
  const currentMonthIndex = selectedMonth ?? (now.getMonth() + 1);
  const currentYearVal = selectedYear ?? now.getFullYear();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/time-entries/monthly-summary?year=${currentYearVal}&month=${currentMonthIndex}`)
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => {
        console.warn("Backend monthly summary not reachable or returned error, computing local fallback:", err);
        // Compute fallback summary from entries matching the month/year
        const monthPrefix = `${currentYearVal}-${String(currentMonthIndex).padStart(2, '0')}`;
        const filteredEntries = entries.filter((e) => e.workDate && e.workDate.startsWith(monthPrefix));
        
        let totalWorkedMinutes = 0;
        let totalShortMinutes = 0;
        let totalSurplusMinutes = 0;

        filteredEntries.forEach((e) => {
          const worked = parseFloat(e.workedHours) || 0;
          const short = parseFloat(e.shortHours) || 0;
          const surplus = parseFloat(e.surplusHours) || 0;
          totalWorkedMinutes += Math.round(worked * 60);
          totalShortMinutes += Math.round(short * 60);
          totalSurplusMinutes += Math.round(surplus * 60);
        });

        setSummary({
          totalWorkedMinutes,
          totalShortMinutes,
          totalSurplusMinutes,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshKey, currentMonthIndex, currentYearVal, entries]);

  const handleExportCSV = () => {
    const monthPrefix = `${currentYearVal}-${String(currentMonthIndex).padStart(2, '0')}`;
    const filteredEntries = entries.filter((e) => e.workDate && e.workDate.startsWith(monthPrefix));
    const entriesToExport = filteredEntries.length > 0 ? filteredEntries : entries;

    const success = exportToCSV(entriesToExport, summary, currentMonthIndex, currentYearVal);
    if (success) {
      addNotification({
        title: "CSV Export Ready",
        message: `Exported ${entriesToExport.length} entries for ${MONTHS[currentMonthIndex - 1]} ${currentYearVal}.`,
        type: "success",
      });
    }
  };

  const handlePrint = () => {
    triggerPrint();
  };

  // Productivity ratio calculation
  const totalMins = (summary?.totalWorkedMinutes || 0) + (summary?.totalShortMinutes || 0);
  const productivityScore = totalMins > 0 
    ? Math.min(100, Math.round(((summary?.totalWorkedMinutes || 0) / totalMins) * 100))
    : 100;

  return (
    <div className="glass-card">
      {/* Month / Year Selector & Action Toolbar */}
      <div className="card-title-row no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <h2>
            <Calendar size={20} color="var(--primary-light)" />
            Monthly Work Analytics
          </h2>

          <div style={{ display: "flex", gap: "6px" }}>
            <select
              value={currentMonthIndex}
              onChange={(e) => setSelectedMonth?.(Number(e.target.value))}
              style={{ width: "auto", minHeight: "38px", padding: "6px 10px", fontSize: "0.82rem", fontWeight: 600, borderRadius: "10px" }}
              aria-label="Select month"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={currentYearVal}
              onChange={(e) => setSelectedYear?.(Number(e.target.value))}
              style={{ width: "auto", minHeight: "38px", padding: "6px 10px", fontSize: "0.82rem", fontWeight: 600, borderRadius: "10px" }}
              aria-label="Select year"
            >
              {[2024, 2025, 2026, 2027].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} title="Export current view to CSV">
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print or Save as PDF Timesheet">
            <Printer size={15} />
            <span>Print Timesheet</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (2x2 on Mobile, 4x1 on Desktop) */}
      <div className="dashboard-cards" style={{ marginBottom: 0 }}>
        <div className="metric-card blue">
          <div className="metric-icon-wrapper">
            <Briefcase size={20} />
          </div>
          <div className="metric-content">
            <h3>Total Worked</h3>
            <p>{formatMinutes(summary?.totalWorkedMinutes)}</p>
          </div>
        </div>

        <div className="metric-card red">
          <div className="metric-icon-wrapper">
            <AlertCircle size={20} />
          </div>
          <div className="metric-content">
            <h3>Total Short</h3>
            <p>{formatMinutes(summary?.totalShortMinutes)}</p>
          </div>
        </div>

        <div className="metric-card green">
          <div className="metric-icon-wrapper">
            <CheckCircle size={20} />
          </div>
          <div className="metric-content">
            <h3>Total Surplus</h3>
            <p>{formatMinutes(summary?.totalSurplusMinutes)}</p>
          </div>
        </div>

        <div className="metric-card purple">
          <div className="metric-icon-wrapper">
            <TrendingUp size={20} />
          </div>
          <div className="metric-content">
            <h3>Target Completion</h3>
            <p>{productivityScore}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlySummary;
