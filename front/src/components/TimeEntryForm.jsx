import { useState, useEffect } from "react";
import { createTimeEntry } from "../services/timeEntryService";
import { PlusCircle, AlertTriangle, Sparkles, Check, Clock } from "lucide-react";
import { useNotification } from "../context/NotificationContext";

function TimeEntryForm({ onSuccess, prefillData, onClearPrefill }) {
  const { addNotification } = useNotification();
  const [form, setForm] = useState({
    workDate: new Date().toISOString().split("T")[0],
    inTime: "09:00",
    outTime: "18:00",
    requiredHours: 8.67, // 8h 40m default
    remarks: "",
  });

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute required hours based on month
  const updateReqHoursForDate = (dateStr) => {
    if (!dateStr) return 8.67;
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    // Jan-Mar is 8h 18m (8.30), rest is 8h 40m (8.67)
    return month >= 1 && month <= 3 ? 8 + 18 / 60 : 8 + 40 / 60;
  };

  // Sync prefill from stopwatch
  useEffect(() => {
    if (prefillData) {
      setForm((prev) => ({
        ...prev,
        workDate: prefillData.workDate || prev.workDate,
        inTime: prefillData.inTime || prev.inTime,
        outTime: prefillData.outTime || prev.outTime,
        remarks: prefillData.remarks || prev.remarks,
        requiredHours: updateReqHoursForDate(prefillData.workDate || prev.workDate),
      }));
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillData, onClearPrefill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    if (name === "workDate" && value) {
      updated.requiredHours = updateReqHoursForDate(value);
    }
    setForm(updated);
  };

  const applyPreset = (inTime, outTime, label) => {
    setForm((prev) => ({
      ...prev,
      inTime,
      outTime,
      remarks: prev.remarks || label,
    }));
  };

  // Live calculation preview
  const calculatePreview = () => {
    if (!form.inTime || !form.outTime) return null;
    const [inH, inM] = form.inTime.split(":").map(Number);
    const [outH, outM] = form.outTime.split(":").map(Number);
    const diffMinutes = outH * 60 + outM - (inH * 60 + inM);
    if (diffMinutes <= 0) return null;

    const workedH = (diffMinutes / 60).toFixed(2);
    const req = Number(form.requiredHours);
    const diff = (workedH - req).toFixed(2);
    return {
      worked: workedH,
      surplus: diff > 0 ? diff : "0.00",
      short: diff < 0 ? Math.abs(diff).toFixed(2) : "0.00",
    };
  };

  const preview = calculatePreview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await createTimeEntry(form);
      setResult(response);
      
      const isSurplus = parseFloat(response.surplusHours) > 0;
      const isShort = parseFloat(response.shortHours) > 0;

      addNotification({
        title: "Entry Logged Successfully",
        message: `${form.workDate}: Logged ${response.workedHours} hrs (${
          isSurplus ? `+${response.surplusHours} surplus` : isShort ? `-${response.shortHours} short` : "target met"
        })`,
        type: isShort ? "warning" : "success",
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      const errMsg = err.message || "An unexpected error occurred while logging time.";
      setError(errMsg);
      addNotification({
        title: "Failed to Save Entry",
        message: errMsg,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: "28px" }}>
      <div className="card-title-row">
        <h2>
          <Clock size={22} color="var(--primary-light)" />
          Log Work Hours
        </h2>
        {preview && (
          <span className="status-badge status-neutral" style={{ fontSize: "0.85rem" }}>
            Preview: <strong>{preview.worked}h</strong>
            {parseFloat(preview.surplus) > 0 && <span style={{ color: "var(--success)" }}> (+{preview.surplus}h)</span>}
            {parseFloat(preview.short) > 0 && <span style={{ color: "var(--error)" }}> (-{preview.short}h)</span>}
          </span>
        )}
      </div>

      {/* Quick Shift Presets */}
      <div className="preset-chips no-print">
        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
          Quick Shifts:
        </span>
        <button
          type="button"
          className="preset-chip"
          onClick={() => applyPreset("09:00", "18:00", "Regular Full Day Shift")}
        >
          ☀️ Standard 9:00 - 18:00
        </button>
        <button
          type="button"
          className="preset-chip"
          onClick={() => applyPreset("09:00", "13:30", "Morning Half Day")}
        >
          🌅 Morning 9:00 - 13:30
        </button>
        <button
          type="button"
          className="preset-chip"
          onClick={() => applyPreset("14:00", "19:00", "Afternoon Half Day")}
        >
          🌆 Afternoon 14:00 - 19:00
        </button>
        <button
          type="button"
          className="preset-chip"
          onClick={() => applyPreset("09:00", "20:30", "Deep Work Sprint + Overtime")}
        >
          ⚡ Extended 9:00 - 20:30
        </button>
      </div>

      {error && (
        <div className="error" role="alert">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="workDate">Work Date</label>
          <input
            id="workDate"
            type="date"
            name="workDate"
            value={form.workDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="requiredHours">Required Hours (Auto)</label>
          <input
            id="requiredHours"
            type="number"
            step="0.01"
            name="requiredHours"
            value={Number(form.requiredHours).toFixed(2)}
            readOnly
          />
        </div>

        <div className="input-group">
          <label htmlFor="inTime">Time In</label>
          <input
            id="inTime"
            type="time"
            name="inTime"
            value={form.inTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="outTime">Time Out</label>
          <input
            id="outTime"
            type="time"
            name="outTime"
            value={form.outTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group form-row-full">
          <label htmlFor="remarks">Task Description / Remarks</label>
          <input
            id="remarks"
            type="text"
            name="remarks"
            placeholder="e.g. Worked on Spring Boot REST API and unit tests"
            value={form.remarks}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary form-row-full"
          disabled={isSubmitting}
          style={{ width: "100%", marginTop: "8px" }}
        >
          {isSubmitting ? (
            <span>Saving Entry...</span>
          ) : (
            <>
              <PlusCircle size={20} />
              Save Time Entry
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="result stagger-1" style={{ marginTop: "20px" }}>
          <p>
            <span>Total Worked</span>
            <strong style={{ color: "var(--text-main)" }}>{result.workedHours} hrs</strong>
          </p>
          <p>
            <span>Short Time</span>
            <strong style={{ color: parseFloat(result.shortHours) > 0 ? "var(--error)" : "var(--text-muted)" }}>
              {result.shortHours} hrs
            </strong>
          </p>
          <p>
            <span>Surplus Time</span>
            <strong style={{ color: parseFloat(result.surplusHours) > 0 ? "var(--success)" : "var(--text-muted)" }}>
              {result.surplusHours} hrs
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default TimeEntryForm;
