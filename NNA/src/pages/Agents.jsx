import { useCallback, useState, useRef } from "react";
import PerformanceChart from "../components/PerformanceChart";
import DAGTopo from "../components/DAGTopo";
import DAGSugi from "../components/DAGSugi";
import Properties from "../components/Properties";
import DropDownProps from "../components/dagComps/DropDownProps";
import AgentSelect from "../components/dagComps/AgentSelect";
import "../styles/Agents.css";
import Agents2 from "./Agents2";

function Agents() {
  const [selectedNode, setSelectedNode] = useState(null);
  const selectedNodeRef = useRef(null);

  const handleNodeClick = useCallback((nodeData) => {
    selectedNodeRef.current = nodeData;
    setSelectedNode(nodeData);
  }, []);

  return (
    <>
      <div>
        {/* <h3> DAG </h3>
        <div className="centered-container">
          <div className="dag-container">
            <AgentSelect node={selectedNode} />
            <DAGSugi onNodeClick={handleNodeClick} />
          </div>
        </div>
        <h3> PerformanceChart </h3>
        <PerformanceChart /> */}
      </div>
    </>
  );
}

export default Agents;
