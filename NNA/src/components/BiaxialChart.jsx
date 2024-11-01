import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import trainingData from "../assets/trainingData.json";

// BiaxialLineChart accepts [{"iterationNumber":0,"accuracy":0.1,"trainingTime":100},{"iterationNumber":n,"accuracy":n,"trainingTime":n}]

function BiaxialLineChart() {
  const [chartSize, setChartSize] = useState({
    width: window.innerWidth * 0.5,
    height: window.innerHeight * 0.5,
  });

  useEffect(() => {
    const handleResize = () => {
      setChartSize({
        width: window.innerWidth * 0.5,
        height: window.innerHeight * 0.5,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Transform data arrays into an array of objects
  const data =
    trainingData.iterationNumber?.map((iteration, index) => ({
      iterationNumber: iteration,
      accuracy: trainingData.accuracy[index],
      trainingTime: trainingData.trainingTime[index],
    })) || [];
  console.log("Chart Re-rendered");

  return (
    <LineChart
      width={chartSize.width}
      height={chartSize.height}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="iterationNumber" />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip />
      <Legend />
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
  );
}

export default BiaxialLineChart;
