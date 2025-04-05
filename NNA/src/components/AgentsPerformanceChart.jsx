import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AgentsPerformanceChart({ runtimestamp, agentNum, episodeNum }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Iteration Metrics...");

        const response = await fetch(
          `http://localhost:3000/api/IterationMetric/${encodeURIComponent(runtimestamp)}?agentNum=${agentNum}&episodeNum=${episodeNum}`
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

    fetchData();
  }, [agentNum, episodeNum]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="iterationNumber"
          label={{
            value: "Iteration",
            position: "insideBottom",
            offset: -10,
            stroke: "black",
          }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "#8884d8" }}
          label={{
            value: "Accuracy",
            angle: -90,
            position: "insideLeft",
            stroke: "#8884d8",
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: "#82ca9d" }}
          label={{
            value: "FLOPs",
            angle: 90,
            position: "insideRight",
            stroke: "#82ca9d",
          }}
        />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="top" align="center" />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="accuracy"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="flops"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default AgentsPerformanceChart;
