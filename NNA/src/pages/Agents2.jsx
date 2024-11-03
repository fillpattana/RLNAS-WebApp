import { useCallback, useState, useRef } from "react";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
// Components
import BiaxialChart from "../components/BiaxialChart";
import DAGSugi from "../components/DAGSugi";
import DAGNavBar from "../components/dagComps/DAGNavBar";
import SingleLineChart from "../components/SingleLineChart";
import AgentGroups from "../components/AgentGroups";
// Styles
import "../styles/Agents.css";

function Agents() {
  const [selectedNode, setSelectedNode] = useState(null);
  const selectedNodeRef = useRef(null);
  const [index, setIndex] = useState(0);

  const handleNextIteration = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleNodeClick = useCallback((nodeData) => {
    selectedNodeRef.current = nodeData;
    setSelectedNode(nodeData);
  }, []);

  return (
    <div>
      <Container className="agents-background">
        <Row>
          <h3 className="topic-name">
            Network Architecture - Direct Acyclic Graph
          </h3>
          <Col>
            <AgentGroups />
          </Col>
          <Col>
            {/* <div className="centered-container">
            <div className="dag-container">
              <DAGNavBar node={selectedNode} />
              <DAGSugi onNodeClick={handleNodeClick} />
            </div>
          </div> */}
            <div className="centered-container">
              <Carousel
                fade
                interval={null}
                activeIndex={index}
                onSelect={handleNextIteration}
                data-bs-theme="dark"
              >
                <Carousel.Item>
                  <div className="dag-container">
                    <DAGNavBar node={selectedNode} />
                    <DAGSugi onNodeClick={handleNodeClick} />
                  </div>
                  <Carousel.Caption>
                    <h5>Agent Group 1</h5>
                    <p>Episode 1 - Iteration 1</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="dag-container">
                    <DAGNavBar node={selectedNode} />
                    <DAGSugi onNodeClick={handleNodeClick} />
                  </div>
                  <Carousel.Caption>
                    <h5>Agent Group 1</h5>
                    <p>Episode 1 - Iteration 2</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3 className="topic-name">
              Biaxial Chart - Training Time and Accuracy
            </h3>
            <div className="centered-container">
              <BiaxialChart />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Agents;
