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

const timestamp = "2025-01-02 10:10:10";

function OverviewIterationChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Iteration Metrics for timestamp:", timestamp);

        const response = await fetch(
          `http://localhost:3000/api/OverviewIterationMetric/${timestamp}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching data for timestamp: ${timestamp}`);
        }
        const result = await response.json();

        // Transform backend data to match chart format
        const transformedData = result.map((item, index) => ({
          iterationNumber: index + 1, // Use index as iteration number
          accuracy: parseFloat(item.accuracy),
          trainingtime: parseInt(item.trainingtime, 10),
        }));

        setChartData(transformedData);

        console.log(
          `Performance Chart data fetched for Timestamp ${timestamp}:`,
          transformedData
        );
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [timestamp]);

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
            value: "Training Time",
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
          dataKey="trainingtime"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default OverviewIterationChart;
