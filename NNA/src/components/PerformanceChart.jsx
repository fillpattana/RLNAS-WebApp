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
import trainingData from "../assets/trainingData.json";
import trainingDataNoIteration from "../assets/trainingDataNoIteration.json";

// BiaxialLineChart accepts [{"iterationNumber":0,"accuracy":0.1,"trainingTime":100},{"iterationNumber":n,"accuracy":n,"trainingTime":n}]

function PerformanceChart() {
  // Transform data arrays into an array of objects with iterationNumber in JSON
  const data =
    trainingData.iterationNumber?.map((iteration, index) => ({
      iterationNumber: iteration,
      accuracy: trainingData.accuracy[index],
      trainingTime: trainingData.trainingTime[index],
    })) || [];

  // const data =
  //   trainingDataNoIteration.accuracy?.map((accuracy, index) => ({
  //     iterationNumber: index, // Use the index as the iteration number
  //     accuracy: accuracy,
  //     trainingTime: trainingDataNoIteration.trainingTime[index],
  //   })) || [];
  console.log("Chart Re-rendered");

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
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
          dataKey="trainingTime"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default PerformanceChart;
