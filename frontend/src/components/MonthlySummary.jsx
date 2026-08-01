import { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, AlertCircle, CheckCircle } from "lucide-react";

function MonthlySummary({ refreshKey }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    axios
      .get(`http://localhost:8080/api/time-entries/monthly-summary?year=${year}&month=${month}`)
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, [refreshKey]);

  if (!summary) return null;

  const format = m => `${Math.floor(m / 60)}h ${m % 60}m`;

  return (
    <div className="dashboard-cards stagger-1">
      <div className="metric-card blue">
        <div className="metric-icon-wrapper">
          <Briefcase size={28} />
        </div>
        <div className="metric-content">
          <h3>Total Worked</h3>
          <p>{format(summary.totalWorkedMinutes)}</p>
        </div>
      </div>

      <div className="metric-card red stagger-2">
        <div className="metric-icon-wrapper">
          <AlertCircle size={28} />
        </div>
        <div className="metric-content">
          <h3>Total Short</h3>
          <p>{format(summary.totalShortMinutes)}</p>
        </div>
      </div>

      <div className="metric-card green stagger-3">
        <div className="metric-icon-wrapper">
          <CheckCircle size={28} />
        </div>
        <div className="metric-content">
          <h3>Total Surplus</h3>
          <p>{format(summary.totalSurplusMinutes)}</p>
        </div>
      </div>
    </div>
  );
}

export default MonthlySummary;
