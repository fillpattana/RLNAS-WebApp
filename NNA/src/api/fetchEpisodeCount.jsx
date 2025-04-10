export const fetchEpisodeCount = async (timestamp, agentNum) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/EpisodeCount/${encodeURIComponent(
        timestamp
      )}/${encodeURIComponent(agentNum)}`
    );
    const data = await response.json();

    if (data.totalepisodes) {
      const totalepisodes = parseInt(data.totalepisodes, 10);
      return Array.from({ length: totalepisodes }, (_, i) => ({
        name: `Episode ${i}`,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching episode count:", error);
    return [];
  }
};
