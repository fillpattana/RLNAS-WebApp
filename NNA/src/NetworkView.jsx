import { useCallback, useState, useRef } from "react";
import nodeData from "./assets/nodeDataWithConv3.json";
import trainingData from "./assets/trainingData.json";
import Chart from "./components/Chart";
import DAG from "./components/DAG";
import DAG2 from "./components/DAG2";
import Properties from "./components/Properties";
import "./styles.css";

function NetworkView() {
  const numberOfLayers = nodeData.Graph.nodes.length;
  const selectedNodeRef = useRef(null);

  const handleNodeClick = useCallback((nodeData) => {
    selectedNodeRef.current = nodeData;
  }, []);

  return (
    <>
      <div>
        <h1>Sampled Data</h1>
        <h3>Graph Data</h3>
        <p>{JSON.stringify(nodeData)}</p>
        <p> Number of Layers: {numberOfLayers}</p>

        <h3>Training Data</h3>
        <p>{JSON.stringify(trainingData)}</p>
      </div>
      <div>
        <h1> Elements </h1>
        <h3> Chart </h3>
        <Chart />
        <h3> DAG </h3>
        <div className="centered-container">
          <div className="dag-container">
            <DAG2 onNodeClick={handleNodeClick} />
          </div>
        </div>
        <h3> Properties </h3>
        <Properties node={selectedNodeRef} />
      </div>
    </>
  );
}

export default NetworkView;
