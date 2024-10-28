import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useCallback, useState, useRef } from "react";
import Chart from "../components/Chart";
import DAGSugi from "../components/DAGSugi";
import DAGNavBar from "../components/dagComps/DAGNavBar";
import "../styles/Agents.css";

function Agents() {
  const [selectedNode, setSelectedNode] = useState(null);
  const selectedNodeRef = useRef(null);

  const handleNodeClick = useCallback((nodeData) => {
    selectedNodeRef.current = nodeData;
    setSelectedNode(nodeData);
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h3> Network Architecture - Direct Acyclic Graph </h3>
          <div className="centered-container">
            <div className="dag-container">
              <DAGNavBar node={selectedNode} />
              <DAGSugi onNodeClick={handleNodeClick} />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3> Biaxial Chart - Training Time and Accuracy </h3>
          <div className="centered-container">
            <Chart />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3> Simple Line Chart - Loss/Epoch Chart </h3>
          <div className="centered-container">
            <Chart />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Agents;
