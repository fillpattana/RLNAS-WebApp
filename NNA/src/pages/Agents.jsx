import { useCallback, useState, useRef } from "react";
import BiaxialChart from "../components/BiaxialChart";
import DAGTopo from "../components/DAGTopo";
import DAGSugi from "../components/DAGSugi";
import Properties from "../components/Properties";
import DropDownProps from "../components/dagComps/DropDownProps";
import DAGNavBar from "../components/dagComps/DAGNavBar";
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
        <h1> Elements </h1>
        {/* <h3> DAG </h3>
        <div className="centered-container">
          <div className="dag-container">
            <DAGNavBar node={selectedNode} />
            <DAGSugi onNodeClick={handleNodeClick} />
          </div>
        </div>
        <h3> BiaxialChart </h3>
        <BiaxialChart /> */}
        <h3> Structure </h3>
        <Agents2 />
      </div>
    </>
  );
}

export default Agents;
