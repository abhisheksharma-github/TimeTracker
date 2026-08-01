import { useEffect, useState } from "react";
import TimeEntryForm from "./components/TimeEntryForm";
import TimeEntryTable from "./components/TimeEntryTable";
import MonthlySummary from "./components/MonthlySummary";
import { getAllEntries } from "./services/timeEntryService";
import { Clock } from "lucide-react";
import "./App.css";

function App() {
  const [entries, setEntries] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadEntries = async () => {
    try {
      const data = await getAllEntries();
      setEntries(data);
    } catch (err) {
      console.error("Failed to load entries:", err);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSuccess = () => {
    loadEntries();
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container">
      <h1>
        <Clock size={36} color="var(--primary-light)" style={{ verticalAlign: 'middle', marginRight: '12px' }} />
        Daily Time Tracker
      </h1>

      <MonthlySummary refreshKey={refreshKey} />

      <div className="stagger-3">
        <TimeEntryForm onSuccess={handleSuccess} />
      </div>

      <div className="stagger-4">
        <TimeEntryTable entries={entries} />
      </div>
    </div>
  );
}

export default App;
