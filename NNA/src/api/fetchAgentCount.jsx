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
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching agent count:", error);
    return [];
  }
};
