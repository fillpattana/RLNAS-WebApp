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
import Episodes from "../components/Episodes";
// Styles
import "../styles/Agents.css";
// Samples
const episodes = [
  { name: "Episode 1" },
  { name: "Episode 2" },
  { name: "Episode 3" },
  { name: "Episode 4" },
  { name: "Episode 5" },
  { name: "Episode 6" },
  { name: "Episode 7" },
  { name: "Episode 8" },
  { name: "Episode 9" },
  { name: "Episode 10" },
  { name: "Episode 11" },
  { name: "Episode 12" },
  { name: "Episode 13" },
  { name: "Episode 14" },
  { name: "Episode 15" },
  { name: "Episode 16" },
  { name: "Episode 17" },
  { name: "Episode 18" },
  { name: "Episode 19" },
  { name: "Episode 20" },
  { name: "Episode 21" },
  { name: "Episode 22" },
  { name: "Episode 23" },
  { name: "Episode 24" },
];

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
        <div className="elements-container">
          <Row>
            <h3 className="topic-name">
              Network Architecture - Direct Acyclic Graph
            </h3>
            <Col>
              <Episodes episode={episodes} />
            </Col>
            <Col>
              <div className="centered-container">
                <div className="shadow-lg rounded">
                  <Carousel
                    fade
                    interval={null}
                    activeIndex={index}
                    onSelect={handleNextIteration}
                    data-bs-theme="dark"
                  >
                    <Carousel.Item>
                      <DAGNavBar node={selectedNode} />
                      <DAGSugi onNodeClick={handleNodeClick} />
                      <Carousel.Caption>
                        <h5>Agent 1</h5>
                        <p>Episode 1 - Iteration 1</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <DAGNavBar node={selectedNode} />
                      <DAGSugi onNodeClick={handleNodeClick} />
                      <Carousel.Caption>
                        <h5>Agent 1</h5>
                        <p>Episode 1 - Iteration 2</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>
                </div>
              </div>
            </Col>
          </Row>
        </div>
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
