const API_URL = "http://localhost:8080/api/time-entries";

export const createTimeEntry = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};

export const getAllEntries = async () => {
  const response = await fetch(API_URL);
  return response.json();
};
export const deleteEntry = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

export const updateEntry = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};