export const fetchOverallLossData = async () => {
  try {
    console.log("Fetching Loss Metrics...");

    const response = await fetch(
      `http://localhost:3000/api/LossMetric/${encodeURIComponent(runtimestamp)}`
    );
    if (!response.ok) {
      throw new Error(`Loss chart is receiving timestamp=${runtimestamp}`);
    }
    const result = await response.json();

    // Transform backend data to the format required by the chart
    const transformedData = result.map((item) => ({
      loss: parseFloat(item.loss),
      epoch: parseInt(item.epoch, 10),
    }));

    setChartData(transformedData);

    console.log(
      `Loss Chart data fetched for runtimestamp: ${runtimestamp}`,
      transformedData
    );
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};
