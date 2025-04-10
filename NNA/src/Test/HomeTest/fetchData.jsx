// src/utils/fetchData.js

export const fetchData = async (setSessions) => {
  try {
    const response = await fetch("http://localhost:3000/api/ActiveSessions");
    const data = await response.json();
    setSessions(data);
  } catch (error) {
    console.error("Error fetching sessions:", error);
  }
};
// This function fetches session data from the API and updates the state with the received data.
