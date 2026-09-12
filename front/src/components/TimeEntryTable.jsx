import { useState, useMemo } from "react";
import { Search, Trash2, Calendar, FileSpreadsheet, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { deleteEntry } from "../services/timeEntryService";
import { useNotification } from "../context/NotificationContext";

function TimeEntryTable({ entries, onDeleteSuccess }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const { addNotification } = useNotification();

  const filteredEntries = useMemo(() => {
    if (!entries) return [];

    return entries.filter((item) => {
      // Search matches
      const matchesSearch =
        (item.workDate && item.workDate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.remarks && item.remarks.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Status filter
      const hasShort = parseFloat(item.shortHours) > 0;
      const hasSurplus = parseFloat(item.surplusHours) > 0;

      if (statusFilter === "surplus") return hasSurplus;
      if (statusFilter === "short") return hasShort;
      if (statusFilter === "met") return !hasShort && !hasSurplus;

      return true;
    });
  }, [entries, searchTerm, statusFilter]);

  const handleDelete = async (id, date) => {
    if (!window.confirm(`Are you sure you want to delete the time entry for ${date}?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteEntry(id);
      addNotification({
        title: "Entry Deleted",
        message: `Successfully removed time entry for ${date}.`,
        type: "info",
      });
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      addNotification({
        title: "Delete Failed",
        message: err.message || "Failed to delete time entry.",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "—";
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return ts;
    }
  };

  return (
    <div className="glass-card">
      <div className="card-title-row">
        <h2>
          <Clock size={22} color="var(--primary-light)" />
          Timesheet Logs ({filteredEntries.length})
        </h2>

        {/* Filter Pills */}
        <div className="filter-pills no-print">
          <button
            className={`filter-pill ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All Logs
          </button>
          <button
            className={`filter-pill ${statusFilter === "surplus" ? "active" : ""}`}
            onClick={() => setStatusFilter("surplus")}
          >
            ✨ Surplus
          </button>
          <button
            className={`filter-pill ${statusFilter === "short" ? "active" : ""}`}
            onClick={() => setStatusFilter("short")}
          >
            ⚠️ Short
          </button>
          <button
            className={`filter-pill ${statusFilter === "met" ? "active" : ""}`}
            onClick={() => setStatusFilter("met")}
          >
            🎯 Met Target
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="filter-bar no-print">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search entries by date (YYYY-MM-DD) or remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      {!filteredEntries || filteredEntries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <FileSpreadsheet size={40} color="var(--text-muted)" style={{ marginBottom: "12px", opacity: 0.6 }} />
          <h3 style={{ margin: 0, color: "var(--text-muted)", fontSize: "1.1rem" }}>
            {searchTerm || statusFilter !== "all"
              ? "No entries match your search/filter criteria."
              : "No time entries recorded yet."}
          </h3>
          <p style={{ fontSize: "0.85rem", marginTop: "6px", color: "var(--text-dim)" }}>
            Log your first shift above or use the live stopwatch to get started.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Work Date</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Worked</th>
                <th>Short</th>
                <th>Surplus</th>
                <th>Remarks / Notes</th>
                <th>Recorded At</th>
                <th className="no-print" style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEntries.map((e, index) => {
                const hasShort = parseFloat(e.shortHours) > 0;
                const hasSurplus = parseFloat(e.surplusHours) > 0;

                return (
                  <tr key={e.id || index}>
                    <td style={{ fontWeight: 600, color: "var(--primary-light)", whiteSpace: "nowrap" }}>
                      {e.workDate}
                    </td>
                    <td className="mono-font">{e.inTime}</td>
                    <td className="mono-font">{e.outTime}</td>
                    <td className="mono-font" style={{ fontWeight: 700 }}>
                      {e.workedHours} hrs
                    </td>
                    <td>
                      <span className={`status-badge ${hasShort ? "status-short" : "status-neutral"}`}>
                        {hasShort && <AlertCircle size={12} />}
                        {e.shortHours}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${hasSurplus ? "status-surplus" : "status-neutral"}`}>
                        {hasSurplus && <CheckCircle size={12} />}
                        {e.surplusHours}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.88rem", maxWidth: "200px" }}>
                      {e.remarks || <span style={{ color: "var(--text-dim)" }}>—</span>}
                    </td>
                    <td style={{ fontSize: "0.82rem", color: "var(--text-dim)", whiteSpace: "nowrap" }}>
                      {formatTimestamp(e.createdAt)}
                    </td>
                    <td className="no-print" style={{ textAlign: "center" }}>
                      <button
                        className="btn-icon"
                        style={{ padding: "6px", color: "var(--error-text)" }}
                        onClick={() => handleDelete(e.id, e.workDate)}
                        disabled={deletingId === e.id}
                        title="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TimeEntryTable;
