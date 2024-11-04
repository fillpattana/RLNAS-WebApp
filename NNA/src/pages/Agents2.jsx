import { useCallback, useState, useRef, useEffect } from "react";
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
import Properties from "../components/Properties";
// Samples

const agents = [
  { id: "Agent 1", name: "Agent 1" },
  { id: "Agent 2", name: "Agent 2" },
  { id: "Agent 3", name: "Agent 3" },
  { id: "Agent 4", name: "Agent 4" },
  { id: "Agent 5", name: "Agent 5" },
  { id: "Agent 6", name: "Agent 6" },
  { id: "Agent 7", name: "Agent 7" },
  { id: "Agent 8", name: "Agent 8" },
];

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

// const iterations = [
//   { id: 1, name: "Iteration 1" },
//   { id: 2, name: "Iteration 2" },
//   { id: 3, name: "Iteration 3" },
//   { id: 4, name: "Iteration 4" },
// ];

function Agents() {
  const [selectedNode, setSelectedNode] = useState(null);
  const selectedNodeRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [activeEpisode, setActiveEpisode] = useState(episodes[0]);
  const [activeAgent, setActiveAgent] = useState(agents[0].id);
  const [highlightAgent, setHighlightAgent] = useState("");
  const [highlightEpisode, setHighlightEpisode] = useState("");
  const [highlightProps, setHighlightProps] = useState("");

  useEffect(() => {
    setHighlightAgent("highlight");
    const timer = setTimeout(() => setHighlightAgent(""), 500); // Remove class after animation
    return () => clearTimeout(timer);
  }, [activeAgent]);

  useEffect(() => {
    setHighlightEpisode("highlight");
    const timer = setTimeout(() => setHighlightEpisode(""), 500);
    return () => clearTimeout(timer);
  }, [activeEpisode]);

  useEffect(() => {
    setHighlightProps("highlight");
    const timer = setTimeout(() => setHighlightProps(""), 500);
    return () => clearTimeout(timer);
  }, [selectedNode]);

  //   const [activeIteration, setActiveIteration] = useState(iterations[0]);

  const handleAgentChange = (agentId) => {
    setActiveAgent(agentId);
  };

  const handleEpisodeClick = (episode) => {
    setActiveEpisode(episode);
  };

  const handleNextIteration = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  //   const handleIterationClick = (iteration) => {
  //     setActiveIteration(iteration);
  //   };

  const handleNodeClick = useCallback((nodeData) => {
    selectedNodeRef.current = nodeData;
    setSelectedNode(nodeData);
  }, []);

  return (
    <div>
      <Container>
        <div className="elements-container">
          <Row>
            <h3 className="topic-name">
              Network Architecture - Direct Acyclic Graph
            </h3>
            <Col>
              <Episodes
                episode={episodes}
                activeEpisode={activeEpisode}
                onEpisodeClick={handleEpisodeClick}
              />
            </Col>
            <Col>
              <div className="centered-container">
                <div className="shadow-lg rounded">
                  {/* <Carousel
                    fade
                    interval={null}
                    activeIndex={activeIteration}
                    onSelect={handleIterationClick}
                    data-bs-theme="dark"
                  >
                    {iterations.map((iteration) => (
                      <Carousel.Item key={iteration.id}>
                        <DAGNavBar
                          agents={agents}
                          activeAgent={activeAgent}
                          onAgentChange={handleAgentChange}
                        />
                        <DAGSugi onNodeClick={handleNodeClick} />
                        <Carousel.Caption>
                          <h5>{activeAgent}</h5>
                          <p>
                            {activeEpisode.name} - {iteration.name}
                          </p>
                        </Carousel.Caption>
                      </Carousel.Item>
                    ))}
                  </Carousel> */}
                  <Carousel
                    fade
                    interval={null}
                    activeIndex={index}
                    onSelect={handleNextIteration}
                    data-bs-theme="dark"
                  >
                    <Carousel.Item>
                      <DAGNavBar
                        agents={agents}
                        activeAgent={activeAgent}
                        onAgentChange={handleAgentChange}
                      />
                      <DAGSugi onNodeClick={handleNodeClick} />
                      <Carousel.Caption>
                        <h5 className={highlightAgent}>{activeAgent}</h5>
                        <p className={highlightEpisode}>
                          {activeEpisode.name} - Iteration 1
                        </p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <DAGNavBar
                        agents={agents}
                        activeAgent={activeAgent}
                        onAgentChange={handleAgentChange}
                      />
                      <DAGSugi onNodeClick={handleNodeClick} />
                      <Carousel.Caption>
                        <h5 className={highlightAgent}>{activeAgent}</h5>
                        <p className={highlightEpisode}>
                          {activeEpisode.name} - Iteration 2
                        </p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="elements-container">
          <Row>
            <Col>
              <h3 className={`topic-name ${highlightAgent}`}>
                {activeAgent}'s Training Time and Accuracy
              </h3>
              <div className="shadow-lg rounded">
                <div className="centered-container">
                  <BiaxialChart />
                </div>
              </div>
            </Col>
            <Col>
              <h3 className={`topic-name ${highlightProps}`}>
                Node Properties
              </h3>
              <div className="shadow-lg rounded">
                <Properties node={selectedNode} />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Agents;
