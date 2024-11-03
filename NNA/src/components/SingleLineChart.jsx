import React from "react";
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

const data = [
  {
    name: "1",
    loss: 2400,
  },
  {
    name: "2",
    loss: 1398,
  },
  {
    name: "3",
    loss: 9800,
  },
  {
    name: "4",
    loss: 3908,
  },
  {
    name: "5",
    loss: 4800,
  },
  {
    name: "6",
    loss: 3800,
  },
  {
    name: "7",
    loss: 4300,
  },
];

function SingleLineChart() {
  data.iterationNumber?.map((iteration, index) => ({
    iterationNumber: iteration,
    accuracy: trainingData.accuracy[index],
    trainingTime: trainingData.trainingTime[index],
  })) || [];
  console.log("Chart Re-rendered");

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          label={{
            value: "Iteration",
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
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SingleLineChart;
