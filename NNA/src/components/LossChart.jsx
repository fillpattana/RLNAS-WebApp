import React, { useEffect, useState, useRef } from "react";
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

function LossChart({runtimestamp}) {
  const [chartData, setChartData] = useState([]);
  const ws = useRef(null); // WebSocket reference

  const fetchData = async () => {
    try {
      console.log("Fetching Loss Metrics...");

      const response = await fetch(
        `http://localhost:3000/api/LossMetric/${encodeURIComponent(
          runtimestamp
        )}`
      );
      if (!response.ok) {
        throw new Error(
          `Performance chart is receiving timestamp=${runtimestamp}`
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
        `Performance Chart data fetched for runtimestamp: ${runtimestamp}`,
        transformedData
      );
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [runtimestamp]);

  useEffect(() => {
    // WebSocket setup
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => {
      console.log("WebSocket connected (LossMetricsChart)");
      // Subscribe to the "new_lossmetrics" channel
      ws.current.send(JSON.stringify({ type: "subscribe", channel: "new_lossmetrics" }));
    };

    ws.current.onmessage = (event) => {
      try {
        const realTimeData = JSON.parse(event.data);
        console.log("Received WebSocket update in LossMetricsChart:", realTimeData);

        // Trigger data refresh on new_iterationmetrics
        fetchData();
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    ws.current.onerror = (err) => console.error("WebSocket error:", err);

    ws.current.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setTimeout(() => {
        if (ws.current?.readyState !== 1) {
          ws.current = new WebSocket("ws://localhost:3000");
        }
      }, 3000);
    };

    return () => {
      ws.current?.close();
    };
  }, [runtimestamp]);
    
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
