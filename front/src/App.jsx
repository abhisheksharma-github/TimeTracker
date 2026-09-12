import { useEffect, useState, useRef } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import Navbar from "./components/Navbar";
import LiveTimer from "./components/LiveTimer";
import MonthlySummary from "./components/MonthlySummary";
import TimeEntryForm from "./components/TimeEntryForm";
import TimeEntryTable from "./components/TimeEntryTable";
import CalendarView from "./components/CalendarView";
import WeeklyView from "./components/WeeklyView";
import ToastContainer from "./components/ToastContainer";
import { getAllEntries } from "./services/timeEntryService";
import { LayoutDashboard, Calendar as CalendarIcon, BarChart3, Clock } from "lucide-react";
import "./App.css";

function AppContent() {
  const [entries, setEntries] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "calendar" | "weekly"

  // Month & Year state shared across Summary and Calendar
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Live Timer states
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  const loadEntries = async () => {
    try {
      const data = await getAllEntries();
      setEntries(data || []);
    } catch (err) {
      console.error("Failed to load entries:", err);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [refreshKey]);

  const handleSuccess = () => {
    loadEntries();
    setRefreshKey((prev) => prev + 1);
  };

  const handleApplyTimerToForm = (data) => {
    setPrefillData(data);
    setActiveTab("dashboard");
    // Smooth scroll down to form
    const formEl = document.getElementById("workDate");
    if (formEl) {
      formEl.focus();
    }
  };

  const handleTimerPillClick = () => {
    const timerEl = document.getElementById("live-timer-section");
    if (timerEl) {
      timerEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container">
      {/* Printable Header for Timesheet PDF */}
      <div className="print-header" style={{ display: "none" }}>
        <h1>TimeTracker — Official Timesheet Report</h1>
        <p>
          Generated: {new Date().toLocaleDateString()} | Employee Log Archive
        </p>
      </div>

      {/* Top Navbar */}
      <Navbar
        activeTimerSeconds={activeSeconds}
        isTimerRunning={isTimerRunning}
        onTimerClick={handleTimerPillClick}
      />

      {/* Live Interactive Task Stopwatch */}
      <LiveTimer
        onApplyToForm={handleApplyTimerToForm}
        activeSeconds={activeSeconds}
        setActiveSeconds={setActiveSeconds}
        isRunning={isTimerRunning}
        setIsRunning={setIsTimerRunning}
      />

      {/* View Switcher Tabs */}
      <div className="tabs-bar no-print">
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard & Logs
        </button>

        <button
          className={`tab-btn ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => setActiveTab("calendar")}
        >
          <CalendarIcon size={18} />
          Monthly Calendar
        </button>

        <button
          className={`tab-btn ${activeTab === "weekly" ? "active" : ""}`}
          onClick={() => setActiveTab("weekly")}
        >
          <BarChart3 size={18} />
          Weekly Analytics
        </button>
      </div>

      {/* Monthly Summary KPIs */}
      <MonthlySummary
        refreshKey={refreshKey}
        entries={entries}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      {/* Dynamic Tab Views */}
      {activeTab === "dashboard" && (
        <>
          <div className="stagger-1">
            <TimeEntryForm
              onSuccess={handleSuccess}
              prefillData={prefillData}
              onClearPrefill={() => setPrefillData(null)}
            />
          </div>

          <div className="stagger-2">
            <TimeEntryTable
              entries={entries}
              onDeleteSuccess={handleSuccess}
            />
          </div>
        </>
      )}

      {activeTab === "calendar" && (
        <div className="stagger-1">
          <CalendarView
            entries={entries}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </div>
      )}

      {activeTab === "weekly" && (
        <div className="stagger-1">
          <WeeklyView entries={entries} />
        </div>
      )}

      {/* Floating Toast Alerts */}
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
