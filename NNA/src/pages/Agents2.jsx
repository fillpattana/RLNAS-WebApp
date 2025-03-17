import { useCallback, useState, useRef, useEffect } from "react";
// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
// Components
import AgentsPerformanceChart from "../components/AgentsPerformanceChart";
import DAGSugi from "../components/DAGSugi";
import AgentsTab from "../components/dagComps/AgentSelect";
import EpisodeList from "../components/dagComps/EpisodeSelect";
// Styles
import "../styles/Agents.css";
import Properties from "../components/Properties";
import TablesList from "../BackendTest/TablesList";
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
  const [highlighted, setHighlighted] = useState({
    agent: "",
    episode: "",
    props: "",
  });

  const highlightEffect = (key) => {
    setHighlighted((prev) => ({ ...prev, [key]: "highlight" }));
    setTimeout(() => setHighlighted((prev) => ({ ...prev, [key]: "" })), 500);
  };

  useEffect(() => {
    highlightEffect("agent");
  }, [activeAgent]);

  useEffect(() => {
    highlightEffect("episode");
  }, [activeEpisode]);

  useEffect(() => {
    highlightEffect("props");
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
              <EpisodeList
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
                        <AgentsTab
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
                      <AgentsTab
                        agents={agents}
                        activeAgent={activeAgent}
                        onAgentChange={handleAgentChange}
                      />
                      <DAGSugi onNodeClick={handleNodeClick} />
                      <Carousel.Caption>
                        <h5 className={highlighted.agent}>{activeAgent}</h5>
                        <p className={highlighted.episode}>
                          {activeEpisode.name} - Iteration 1
                        </p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <AgentsTab
                        agents={agents}
                        activeAgent={activeAgent}
                        onAgentChange={handleAgentChange}
                      />
                      <DAGSugi onNodeClick={handleNodeClick} />
                      <Carousel.Caption>
                        <h5 className={highlighted.agent}>{activeAgent}</h5>
                        <p className={highlighted.episode}>
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
              <h3 className={`topic-name ${highlighted.agent}`}>
                {activeAgent}'s Training Time and Accuracy
              </h3>
              <div className="shadow-lg rounded">
                <div className="centered-container">
                  <AgentsPerformanceChart agentNum={2} episodeNum={1} />
                </div>
              </div>
            </Col>
            <Col>
              <h3 className={`topic-name ${highlighted.props}`}>
                Node Properties
              </h3>
              <div className="shadow-lg rounded">
                <Properties node={selectedNode} />
              </div>
            </Col>
          </Row>
        </div>
        <div className="elements-container">
          <Row>
            <Col>
              <h3> BackEnd Test </h3>
              <div className="shadow-lg rounded">
                <div className="centered-container">
                  <TablesList />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Agents;
