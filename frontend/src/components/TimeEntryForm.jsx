import { useState } from "react";
import { createTimeEntry } from "../services/timeEntryService";
import { PlusCircle, AlertTriangle } from "lucide-react";

function TimeEntryForm({ onSuccess }) {
  const [form, setForm] = useState({
    workDate: "",
    inTime: "",
    outTime: "",
    requiredHours: 8,
  });

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === "workDate" && value) {
      const date = new Date(value);
      const month = date.getMonth() + 1;
      if (month === 1 || month === 2 || month === 3) {
        updatedForm.requiredHours = 8 + 18 / 60;
      } else {
        updatedForm.requiredHours = 8 + 40 / 60;
      }
    }
    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const response = await createTimeEntry(form);
      setResult(response);
      onSuccess();
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="glass-card">
      <h2>Log New Time</h2>

      {error && (
        <div className="error">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="workDate">Date</label>
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
          <label htmlFor="requiredHours">Req. Hours (Auto)</label>
          <input
            id="requiredHours"
            type="number"
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

        <button type="submit">
          <PlusCircle size={20} />
          Save Entry
        </button>
      </form>

      {result && (
        <div className="result stagger-1">
          <p><span>Worked</span> {result.workedHours}</p>
          <p><span>Short</span> {result.shortHours}</p>
          <p><span>Surplus</span> {result.surplusHours}</p>
        </div>
      )}
    </div>
  );
}

export default TimeEntryForm;
