/**
 * Utilities for exporting TimeTracker data into CSV and triggering clean Print/PDF reports
 */

export function exportToCSV(entries = [], summary = null, month = "", year = "") {
  if (!entries || entries.length === 0) {
    alert("No time entries available to export.");
    return false;
  }

  const filename = `TimeTracker_Timesheet_${year || "All"}_${month || "All"}.csv`;
  const csvRows = [];

  // Metadata headers
  csvRows.push(["TimeTracker Work Summary Report"]);
  csvRows.push([`Generated On`, new Date().toLocaleString()]);
  if (year && month) {
    csvRows.push([`Period`, `${year}-${String(month).padStart(2, '0')}`]);
  }
  if (summary) {
    const formatMin = (m) => `${Math.floor(m / 60)}h ${m % 60}m`;
    csvRows.push([`Total Worked`, formatMin(summary.totalWorkedMinutes || 0)]);
    csvRows.push([`Total Short`, formatMin(summary.totalShortMinutes || 0)]);
    csvRows.push([`Total Surplus`, formatMin(summary.totalSurplusMinutes || 0)]);
  }
  csvRows.push([]); // blank separator line

  // Column Headers
  const headers = ["ID", "Work Date", "Time In", "Time Out", "Worked Hours", "Short Hours", "Surplus Hours", "Remarks", "Recorded At"];
  csvRows.push(headers);

  // Rows
  entries.forEach((entry, idx) => {
    csvRows.push([
      entry.id ?? idx + 1,
      entry.workDate ?? "",
      entry.inTime ?? "",
      entry.outTime ?? "",
      entry.workedHours ?? "0.00",
      entry.shortHours ?? "0.00",
      entry.surplusHours ?? "0.00",
      `"${(entry.remarks || "").replace(/"/g, '""')}"`,
      entry.createdAt ? `"${new Date(entry.createdAt).toLocaleString()}"` : '""'
    ]);
  });

  const csvContent = "\uFEFF" + csvRows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function triggerPrint() {
  window.print();
}
