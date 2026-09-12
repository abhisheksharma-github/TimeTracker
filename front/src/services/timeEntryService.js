// Configurable API URL for local development and Vercel/Render production
const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:8080/api/time-entries";
const LOCAL_STORAGE_KEY = "timetracker_offline_entries";

const getLocalEntries = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalEntries = (entries) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save local entries", e);
  }
};

export const createTimeEntry = async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create time entry");
    }

    const saved = await response.json();
    return saved;
  } catch (err) {
    console.warn("Backend unavailable, using local calculation fallback:", err);
    // Offline / Local fallback calculation with timestamp
    const [inH, inM] = (data.inTime || "09:00").split(":").map(Number);
    const [outH, outM] = (data.outTime || "18:00").split(":").map(Number);
    const diffMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    const worked = (Math.max(0, diffMinutes) / 60).toFixed(2);
    const req = Number(data.requiredHours || 8.67);
    const diff = (worked - req).toFixed(2);

    const fallbackEntry = {
      id: Date.now(),
      workDate: data.workDate,
      inTime: data.inTime,
      outTime: data.outTime,
      workedHours: worked,
      shortHours: diff < 0 ? Math.abs(diff).toFixed(2) : "0.00",
      surplusHours: diff > 0 ? diff : "0.00",
      remarks: data.remarks || "",
      createdAt: new Date().toISOString(),
    };

    const localList = getLocalEntries();
    const updated = [fallbackEntry, ...localList];
    saveLocalEntries(updated);
    return fallbackEntry;
  }
};

export const getAllEntries = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Backend response not ok");
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      saveLocalEntries(data);
      return data;
    }
    return getLocalEntries();
  } catch (err) {
    console.warn("Backend unavailable, loading local cached entries:", err);
    return getLocalEntries();
  }
};

export const deleteEntry = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  } catch (err) {
    console.warn("Backend delete error, removing locally:", err);
  }
  const local = getLocalEntries().filter((e) => e.id !== id);
  saveLocalEntries(local);
};

export const updateEntry = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) {
    console.warn("Backend update error:", err);
    return data;
  }
};