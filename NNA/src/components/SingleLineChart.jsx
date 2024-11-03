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
    epoch: "1",
    loss: 2400,
  },
  {
    epoch: "2",
    loss: 1398,
  },
  {
    epoch: "3",
    loss: 9800,
  },
  {
    epoch: "4",
    loss: 3908,
  },
  {
    epoch: "5",
    loss: 4800,
  },
  {
    epoch: "6",
    loss: 3800,
  },
  {
    epoch: "7",
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
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SingleLineChart;
