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

//no timestamp needs to be selected by user
function OverallAccuracyChart() {
  const [chartData, setChartData] = useState([]);
  const [agents, setAgents] = useState([]);

  // Predefined distinct colors for up to 12 agents
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Iteration Metrics...");
        const response = await fetch(
          `http://localhost:3000/api/OverviewAccMetric/${encodeURIComponent(
            timestamp
          )}`
        );
        if (!response.ok) {
          throw new Error(
            `OverviewAccMetric chart is receiving timestamp=${timestamp}`
          );
        }
        const result = await response.json();

        let transformedData = [];
        let agentNames = new Set();

        // Transform data to match Recharts format
        Object.entries(result).forEach(([agentKey, episodes]) => {
          agentNames.add(agentKey); // Collect agent names

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

        // Sort by episode number
        transformedData.sort((a, b) => a.episodeNum - b.episodeNum);

        setChartData(transformedData);
        setAgents(Array.from(agentNames));

        console.log("Transformed Chart Data:", transformedData);
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
          label={{
            value: "Accuracy",
            angle: -90,
            position: "insideLeft",
            stroke: "#8884d8",
          }}
          domain={[0, 1]} // Assuming accuracy is between 0 and 1
        />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="top" align="center" />

        {/* Generate dynamic lines for each agent */}
        {agents.map((agent, index) => (
          <Line
            key={agent}
            type="monotone"
            dataKey={agent}
            stroke={
              colorPalette[index] || `hsl(${(index * 40) % 360}, 70%, 50%)`
            } // Fallback for more than 12 agents
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default OverallAccuracyChart;

// Requires Timestamp as parameter
// function OverallAccuracyChart({ timestamp }) {
//   const [chartData, setChartData] = useState([]);
//   const [agents, setAgents] = useState([]);

//   // Predefined distinct colors for up to 12 agents
//   const colorPalette = [
//     "#1f77b4",
//     "#ff7f0e",
//     "#2ca02c",
//     "#d62728",
//     "#9467bd",
//     "#8c564b",
//     "#e377c2",
//     "#7f7f7f",
//     "#bcbd22",
//     "#17becf",
//     "#fdae61",
//     "#377eb8",
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         console.log("Fetching Iteration Metrics...");
//         const response = await fetch(
//           `http://localhost:3000/api/OverviewAccMetric/${encodeURIComponent(
//             timestamp
//           )}`
//         );
//         if (!response.ok) {
//           throw new Error(
//             `OverviewAccMetric chart is receiving timestamp=${timestamp}`
//           );
//         }
//         const result = await response.json();

//         let transformedData = [];
//         let agentNames = new Set();

//         // Transform data to match Recharts format
//         Object.entries(result).forEach(([agentKey, episodes]) => {
//           agentNames.add(agentKey); // Collect agent names

//           Object.entries(episodes).forEach(([episodeKey, accuracy]) => {
//             let episodeNum = parseInt(episodeKey.replace("EPISODE", ""), 10);
//             if (!isNaN(episodeNum)) {
//               let existingEntry = transformedData.find(
//                 (entry) => entry.episodeNum === episodeNum
//               );

//               if (!existingEntry) {
//                 existingEntry = { episodeNum };
//                 transformedData.push(existingEntry);
//               }

//               existingEntry[agentKey] = accuracy !== null ? accuracy : null;
//             }
//           });
//         });

//         // Sort by episode number
//         transformedData.sort((a, b) => a.episodeNum - b.episodeNum);

//         setChartData(transformedData);
//         setAgents(Array.from(agentNames));

//         console.log("Transformed Chart Data:", transformedData);
//       } catch (error) {
//         console.error("Error fetching chart data:", error);
//       }
//     };

//     fetchData();
//   }, [timestamp]);

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <LineChart
//         data={chartData}
//         margin={{
//           top: 5,
//           right: 30,
//           left: 20,
//           bottom: 30,
//         }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis
//           dataKey="episodeNum"
//           label={{
//             value: "Episode Number",
//             position: "insideBottom",
//             offset: -10,
//             stroke: "black",
//           }}
//         />
//         <YAxis
//           tick={{ fill: "#8884d8" }}
//           label={{
//             value: "Accuracy",
//             angle: -90,
//             position: "insideLeft",
//             stroke: "#8884d8",
//           }}
//           domain={[0, 1]} // Assuming accuracy is between 0 and 1
//         />
//         <Tooltip />
//         <Legend layout="horizontal" verticalAlign="top" align="center" />

//         {/* Generate dynamic lines for each agent */}
//         {agents.map((agent, index) => (
//           <Line
//             key={agent}
//             type="monotone"
//             dataKey={agent}
//             stroke={
//               colorPalette[index] || `hsl(${(index * 40) % 360}, 70%, 50%)`
//             } // Fallback for more than 12 agents
//             activeDot={{ r: 6 }}
//           />
//         ))}
//       </LineChart>
//     </ResponsiveContainer>
//   );
// }
