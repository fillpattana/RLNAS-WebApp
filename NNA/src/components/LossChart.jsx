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

const timestamp = "2025-04-02 08:57:35.174414";

function LossChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Loss Metrics...");

        const response = await fetch(
          `http://localhost:3000/api/LossMetric/${encodeURIComponent(
            timestamp
          )}`
        );
        if (!response.ok) {
          throw new Error(
            `Performance chart is receiving timestamp=${timestamp}`
          );
        }
        const result = await response.json();

        // Transform backend data to the format required by the chart
        const transformedData = result.map((item) => ({
          loss: parseFloat(item.loss),
          epoch: parseInt(item.epoch, 10),
        }));

        setChartData(transformedData);

        console.log(
          `Performance Chart data fetched for runtimestamp: ${timestamp}`,
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
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="epoch"
          label={{
            value: "Epoch",
            position: "insideBottom",
            offset: -10,
            stroke: "black",
          }}
        />
        <YAxis />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="top" align="center" />
        <Line
          type="monotone"
          dataKey="loss"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LossChart;
