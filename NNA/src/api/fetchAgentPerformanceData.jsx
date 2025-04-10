export const fetchData = async () => {
  try {
    console.log("Fetching Iteration Metrics...");

    const response = await fetch(
      `http://localhost:3000/api/IterationMetric/${encodeURIComponent(
        runtimestamp
      )}?agentNum=${agentNum}&episodeNum=${episodeNum}`
    );
    if (!response.ok) {
      throw new Error(
        `Performance chart is receiving agentNum=${agentNum}&episodeNum=${episodeNum}`
      );
    }
    const result = await response.json();

    // Transform backend data to the format required by the chart
    const transformedData = result.map((item, index) => ({
      iterationNumber: index + 1, // Use index as iteration number
      accuracy: parseFloat(item.accuracy),
      flops: parseInt(item.trainingtime, 10),
    }));

    setChartData(transformedData);

    console.log(
      `Performance Chart data fetched for AgentNum ${agentNum}, EpisodeNum ${episodeNum}:`,
      transformedData
    );
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};
