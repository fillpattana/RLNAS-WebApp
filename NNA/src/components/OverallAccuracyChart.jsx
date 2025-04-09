import React, { useEffect, useRef, useState } from "react";
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

function OverallAccuracyChart({ runtimestamp }) {
  const [chartData, setChartData] = useState([]);
  const [agents, setAgents] = useState([]);
  const ws = useRef(null); // WebSocket reference

  const colorPalette = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#fdae61",
    "#377eb8",
  ];

  const fetchData = async () => {
    try {
      console.log("Fetching Iteration Metrics...");
      const response = await fetch(
        `http://localhost:3000/api/OverviewAccMetric/${encodeURIComponent(
          runtimestamp
        )}`
      );
      if (!response.ok)
        throw new Error(`API call failed with timestamp=${runtimestamp}`);
      const result = await response.json();

      let transformedData = [];
      let agentNames = new Set();

      Object.entries(result).forEach(([agentKey, episodes]) => {
        agentNames.add(agentKey);
        Object.entries(episodes).forEach(([episodeKey, accuracy]) => {
          let episodeNum = parseInt(episodeKey.replace("EPISODE", ""), 10);
          if (!isNaN(episodeNum)) {
            let existingEntry = transformedData.find(
              (entry) => entry.episodeNum === episodeNum
            );
            if (!existingEntry) {
              existingEntry = { episodeNum };
              transformedData.push(existingEntry);
            }
            existingEntry[agentKey] = accuracy !== null ? accuracy : null;
          }
        });
      });

      transformedData.sort((a, b) => a.episodeNum - b.episodeNum);
      setChartData(transformedData);
      setAgents(Array.from(agentNames));

      console.log("Transformed Chart Data:", transformedData);
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
      console.log("WebSocket connected (OverallAccuracyChart)");
      // Subscribe to the "new_iterationmetrics" channel
      ws.current.send(
        JSON.stringify({ type: "subscribe", channel: "new_iterationmetrics" })
      );
    };

    ws.current.onmessage = (event) => {
      try {
        const realTimeData = JSON.parse(event.data);
        console.log(
          "Received WebSocket update in OverallAccuracyChart:",
          realTimeData
        );

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

  const accuracyValues = chartData.flatMap((entry) =>
    agents
      .map((agent) => entry[agent])
      .filter((val) => val !== null && val !== undefined)
  );

  const minAccuracy = Math.min(...accuracyValues);
  const maxAccuracy = Math.max(...accuracyValues);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="episodeNum"
          label={{
            value: "Episode Number",
            position: "insideBottom",
            offset: -10,
            stroke: "black",
          }}
        />
        <YAxis
          tick={{ fill: "#8884d8" }}
          tickFormatter={(value) => value.toFixed(3)}
          label={{
            value: "Accuracy",
            angle: 0,
            position: "insideLeft",
            stroke: "#8884d8",
            dy: 200,
          }}
          // domain={[minAccuracy - 0.01, maxAccuracy + 0.01]}
          domain={["auto", "auto"]}
        />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="top" align="center" />
        {agents.map((agent, index) => (
          <Line
            key={agent}
            type="monotone"
            dataKey={agent}
            stroke={
              colorPalette[index] || `hsl(${(index * 40) % 360}, 70%, 50%)`
            }
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default OverallAccuracyChart;
