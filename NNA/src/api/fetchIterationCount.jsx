export const fetchIterationCount = async (timestamp, agentNum, episodeNum) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/IterationCount/${encodeURIComponent(
        timestamp
      )}/${encodeURIComponent(agentNum)}/${encodeURIComponent(episodeNum)}`
    );
    const data = await response.json();

    return data.totaliterations ? parseInt(data.totaliterations, 10) : 0;
  } catch (error) {
    console.error("Error fetching iteration count:", error);
    return 0;
  }
};
