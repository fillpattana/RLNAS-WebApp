export const fetchAgentCount = async (timestamp) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/AgentCount/${encodeURIComponent(timestamp)}`
    );
    const data = await response.json();
    if (data.totalagents) {
      const totalagents = parseInt(data.totalagents, 10);
      return Array.from({ length: totalagents }, (_, i) => ({
        id: `Agent ${i}`,
        name: `Agent ${i}`,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching agent count:", error);
    throw error;
  }
};

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
    }
    return [];
  } catch (error) {
    console.error("Error fetching episode count:", error);
    throw error;
  }
};

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
    throw error;
  }
};

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
