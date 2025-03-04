import { useState, useEffect, useCallback, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import PerformanceChart from "../components/PerformanceChart";
import DAGSugi from "../components/DAGSugi";
import AgentsTab from "../components/dagComps/AgentSelect";
import EpisodeList from "../components/dagComps/EpisodeSelect";
import "../styles/Agents.css";
import Properties from "../components/Properties";
import TablesList from "../BackendTest/TablesList";
import DAGTest from "../components/DAGTest";

function Agents() {
  const [agents, setAgents] = useState([]);
  const [activeAgent, setActiveAgent] = useState(null);
  const [index, setIndex] = useState(0);
  const [episodes, setEpisodes] = useState([]);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [iterationCount, setIterationCount] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const selectedNodeRef = useRef(null);
  const timestamp = "2025-01-02 10:10:10";

  //get total number of agents for the running session
  useEffect(() => {
    const fetchAgentCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/AgentCount/${encodeURIComponent(
            timestamp
          )}`
        );
        const data = await response.json();

        if (data.totalagents) {
          const totalAgents = parseInt(data.totalagents, 10);
          const generatedAgents = Array.from(
            { length: totalAgents },
            (_, i) => ({
              id: `Agent ${i + 1}`,
              name: `Agent ${i + 1}`,
            })
          );

          setAgents(generatedAgents);
          setActiveAgent(generatedAgents[0]?.id || null);
        } else {
          setAgents([]);
          setActiveAgent(null);
        }
      } catch (error) {
        console.error("Error fetching agent count:", error);
      }
    };

    fetchAgentCount();
  }, [timestamp]);

  //gets total number of episodes for the active agent
  useEffect(() => {
    if (activeAgent) {
      setIndex(0); // Reset iteration index
      const agentNum = activeAgent.split(" ")[1]; // Extract number from "Agent 1"

      const fetchEpisodeCount = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/EpisodeCount/${encodeURIComponent(
              agentNum
            )}`
          );
          const data = await response.json();

          if (data.totalepisodes) {
            const totalEpisodes = parseInt(data.totalepisodes, 10);
            const generatedEpisodes = Array.from(
              { length: totalEpisodes },
              (_, i) => ({
                name: `Episode ${i + 1}`,
              })
            );
            setEpisodes(generatedEpisodes);
            setActiveEpisode(generatedEpisodes[0] || null);
          } else {
            setEpisodes([]);
            setActiveEpisode(null);
          }
        } catch (error) {
          console.error("Error fetching episode count:", error);
        }
      };

      fetchEpisodeCount();
    }
  }, [activeAgent]);

  //gets total number of iterations for the active agent and episode
  useEffect(() => {
    if (activeAgent && activeEpisode) {
      setIndex(0); // Reset iteration index
      const agentNum = activeAgent.split(" ")[1]; // Get agent number
      const episodeNum = activeEpisode.name.split(" ")[1]; // Get episode number

      console.log("Fetching Iterations for agentNum:", agentNum);
      console.log("Fetching Iterations for episodeNum:", episodeNum);

      const fetchIterationCount = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/IterationCount/${encodeURIComponent(
              agentNum
            )}/${encodeURIComponent(episodeNum)}`
          );
          const data = await response.json();

          if (data.totaliterations) {
            setIterationCount(parseInt(data.totaliterations, 10));
          } else {
            setIterationCount(0);
          }
        } catch (error) {
          console.error("Error fetching iteration count:", error);
        }
      };

      fetchIterationCount();
    }
  }, [activeAgent, activeEpisode]);

  const handleAgentChange = (agentId) => setActiveAgent(agentId);
  const handleEpisodeClick = (episode) => setActiveEpisode(episode);
  const handleNextIteration = (selectedIndex) => setIndex(selectedIndex);
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
                  {agents.length > 0 && iterationCount > 0 ? (
                    <Carousel
                      fade
                      interval={null}
                      activeIndex={index}
                      onSelect={(selectedIndex) => setIndex(selectedIndex)}
                      data-bs-theme="dark"
                    >
                      {Array.from({ length: iterationCount }, (_, i) => (
                        <Carousel.Item key={i}>
                          <AgentsTab
                            agents={agents}
                            activeAgent={activeAgent}
                            onAgentChange={handleAgentChange}
                          />
                          <DAGTest
                            iteration={i + 1}
                            agent={activeAgent}
                            episode={activeEpisode?.name}
                          />
                          <Carousel.Caption>
                            <h5>{activeAgent}</h5>
                            <p>
                              {activeEpisode?.name} - Iteration {i + 1}
                            </p>
                          </Carousel.Caption>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <p>
                      The reinforcement learning running session selected does
                      not exist
                    </p>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="elements-container">
          <Row>
            <Col>
              <h3>{activeAgent}'s Training Time and Accuracy</h3>
              <div className="shadow-lg rounded">
                <div className="centered-container">
                  {activeAgent && activeEpisode ? (
                    <PerformanceChart
                      agentNum={activeAgent.split(" ")[1]}
                      episodeNum={activeEpisode.name.split(" ")[1]}
                    />
                  ) : (
                    <p>Loading Performance Chart...</p>
                  )}
                </div>
              </div>
            </Col>
            <Col>
              <h3>Node Properties</h3>
              <div className="shadow-lg rounded">
                <Properties node={selectedNode} />
              </div>
            </Col>
          </Row>
        </div>
        <div className="elements-container">
          <Row>
            <Col>
              <h3>BackEnd Test</h3>
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
