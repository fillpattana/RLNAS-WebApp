import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Iteration 1",
    loss: 2400,
    amt: 2400,
  },
  {
    name: "Iteration 2",
    loss: 1398,
    amt: 2210,
  },
  {
    name: "Iteration 3",
    loss: 9800,
    amt: 2290,
  },
  {
    name: "Iteration 4",
    loss: 3908,
    amt: 2000,
  },
  {
    name: "Iteration 5",
    loss: 4800,
    amt: 2181,
  },
  {
    name: "Iteration 6",
    loss: 3800,
    amt: 2500,
  },
  {
    name: "Iteration 7",
    loss: 4300,
    amt: 2100,
  },
];

function SingleLineChart() {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="loss"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
    </LineChart>
  );
}

export default SingleLineChart;
