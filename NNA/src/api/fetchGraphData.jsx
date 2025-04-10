export const fetchGraphData = async (
  timestamp,
  agentNum,
  episodeNum,
  iterationNum
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/dagJSON/${encodeURIComponent(
        timestamp
      )}/${encodeURIComponent(agentNum)}/${encodeURIComponent(
        episodeNum
      )}/${encodeURIComponent(iterationNum)}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching DAG data:", error);
    return null;
  }
};
