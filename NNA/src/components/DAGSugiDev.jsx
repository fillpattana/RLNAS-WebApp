import { useEffect, useRef, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import Sigma from "sigma";
import { EdgeArrowProgram } from "sigma/rendering";
import sugiyamaLayout from "./dagComps/sugiyamaLayout";

const sigmaStyle = { height: "500px", width: "1000px" };

const fetchGraphData = async (agent, episode, iteration) => {
  const endpoint = `http://localhost:3000/api/dagJSON/${agent}/${episode}/${iteration}`;
  console.log(`Fetching DAG data from: ${endpoint}`);

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log(
      `Received JSON DAG for agent: ${agent} episode: ${episode} iteration: ${iteration}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching DAG data:", error);
    return null;
  }
};

const createGraphSugiyama = (graph, data) => {
  if (!data) return;
  console.log(
    "Creating graph with Sugiyama layout for:",
    JSON.stringify(data.Graph.edges, null, 2)
  );
  const sugiyamaLayoutResult = sugiyamaLayout(data);
  const { layerAssignments, nodePositions } = sugiyamaLayoutResult;

  data.Graph.nodes.forEach((node) => {
    const { index, type, params, activation } = node;
    const layer = layerAssignments.get(index);
    const position = nodePositions.get(index);

    if (layer === undefined || position === undefined) {
      console.error(`Layer or position undefined for node ${index}`);
      return;
    }

    graph.addNode(index.toString(), {
      label: `Node ${index}`,
      size: params?.weights ? 15 + params.weights.flat().length : 15,
      x: layer * 100,
      y: position * 50,
      color:
        type === "dense" ? "#4065fa" : type === "input" ? "#3cba72" : "#FA4F40",
    });
  });

  data.Graph.edges.senders.forEach((sender, idx) => {
    const receiver = data.Graph.edges.receivers[idx];
    if (
      graph.hasNode(sender.toString()) &&
      graph.hasNode(receiver.toString())
    ) {
      graph.addEdgeWithKey(
        `edge${idx}`,
        sender.toString(),
        receiver.toString(),
        {
          label: `Edge ${sender}-${receiver}`,
          color: "#4FA4F0",
          size: 3,
        }
      );
    } else {
      console.error(`Missing sender or receiver for edge ${idx}`);
    }
  });
};

function DAGSugi({ agent, episode, iteration, onNodeClick }) {
  const containerRef = useRef(null);
  const sigmaInstanceRef = useRef(null);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchGraphData(agent, episode, iteration).then((data) => {
      if (isMounted) setGraphData(data);
    });
    return () => {
      isMounted = false;
    };
  }, [agent, episode, iteration]);

  useEffect(() => {
    if (!graphData) return;
    const graph = new MultiDirectedGraph();
    createGraphSugiyama(graph, graphData);
    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "curve",
      hideLabelsOnMove: false,
      allowInvalidContainer: true,
      labelDensity: 10,
      edgeProgramClasses: { curve: EdgeArrowProgram },
    });
    renderer.on("clickNode", (event) => {
      const nodeData = graphData.Graph.nodes.find(
        (n) => n.index.toString() === event.node
      );
      if (nodeData) onNodeClick(nodeData);
    });
    sigmaInstanceRef.current = renderer;
    return () => renderer.kill();
  }, [graphData, onNodeClick]);

  return <div ref={containerRef} style={sigmaStyle}></div>;
}

export default DAGSugi;
