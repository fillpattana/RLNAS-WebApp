import { useCallback, useState, useRef } from "react";
import nodeData from "../assets/nodeDataWithConv3.json";
import trainingData from "../assets/trainingData.json";
import Chart from "../components/Chart";
import DAGTopo from "../components/DAGTopo";
import DAGSugi from "../components/DAGSugi";
import Properties from "../components/Properties";
import "../styles/Agents.css";

function Agents() {
  const numberOfLayers = nodeData.Graph.nodes.length;
  const [selectedNode, setSelectedNode] = useState(null);
  const selectedNodeRef = useRef(null);

  const handleNodeClick = useCallback((nodeData) => {
    selectedNodeRef.current = nodeData;
    setSelectedNode(nodeData); // Trigger update for Properties display
  }, []);

  return (
    <>
      <div>
        <h1> Elements </h1>
        <h3> Chart </h3>
        <Chart />
        <h3> DAG </h3>
        <div className="centered-container">
          <div className="dag-container">
            <DAGSugi onNodeClick={handleNodeClick} />
          </div>
        </div>
        <h3> Properties </h3>
        <Properties node={selectedNode} />
      </div>
    </>
  );
}

export default Agents;
