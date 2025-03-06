import { useEffect, useRef, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import Sigma from "sigma";
import { EdgeArrowProgram } from "sigma/rendering";
import sugiyamaLayout from "./dagComps/sugiyamaLayout";

const sigmaStyle = { height: "500px", width: "1000px" };

// Function to initialize graph with Sugiyama layout applied
const createGraphSugiyama = (graph, data) => {
  console.trace();
  // console.log("createGraphSugiyama called");

  if (!data || !data.Graph) {
    console.error("Invalid DAG data:", data);
    return;
  }

  const sugiyamaLayoutResult = sugiyamaLayout(data);
  const { layerAssignments, nodePositions } = sugiyamaLayoutResult;

  // Add nodes with computed layers and positions
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
      x: layer * 100, // Horizontal positioning
      y: position * 50, // Vertical positioning
      color:
        type === "dense" ? "#4065fa" : type === "input" ? "#3cba72" : "#FA4F40",
    });
  });

  // Add edges
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

function DAGSugiDev({ agentNum, episodeNum, iterationNum, onNodeClick }) {
  const containerRef = useRef(null);
  const sigmaInstanceRef = useRef(null);
  const [dagData, setDagData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentNum || !episodeNum || !iterationNum) return;

    const controller = new AbortController(); // Create an AbortController
    const { signal } = controller;

    const fetchDagData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/dagJSON/${agentNum}/${episodeNum}/${iterationNum}`,
          { signal } // Attach the signal to the fetch request
        );
        if (!response.ok) throw new Error("Failed to fetch DAG data");
        const data = await response.json();
        console.log("Fetched DAG data inside DAGSugi:", data);
        setDagData(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching DAG data within DAGSugi:", error);
          setDagData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDagData();

    return () => controller.abort(); // Cleanup on unmount
  }, [agentNum, episodeNum, iterationNum]);

  useEffect(() => {
    if (!dagData || !dagData.Graph) {
      console.warn("DAGSugi: No valid DAG data received yet.");
      return;
    }

    console.log("Updated DAG data inside DAGSugi:", dagData);

    const graph = new MultiDirectedGraph();
    createGraphSugiyama(graph, dagData);

    // Destroy existing Sigma instance if it exists
    if (sigmaInstanceRef.current) {
      sigmaInstanceRef.current.kill();
    }

    // Initialize new Sigma instance
    sigmaInstanceRef.current = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "curve",
      edgeProgramClasses: { curve: EdgeArrowProgram },
      hideLabelsOnMove: false,
      allowInvalidContainer: true,
      labelDensity: 10,
    });

    // Handle node click event
    sigmaInstanceRef.current.on("clickNode", (event) => {
      const clickedNodeId = event.node;
      const nodeData = dagData.Graph.nodes.find(
        (n) => n.index.toString() === clickedNodeId
      );

      if (!nodeData) {
        console.error(`Node data not found for ID ${clickedNodeId}`);
        return;
      }

      onNodeClick({
        id: clickedNodeId,
        type: nodeData.type,
        activation: nodeData.activation?.type || "none",
        weights: nodeData.params?.weights || [],
        biases: nodeData.params?.biases || [],
      });
    });

    return () => {
      console.log("Component Unmounts - Cleaning up Sigma instance");
      sigmaInstanceRef.current?.kill();
    };
  }, [dagData, onNodeClick]);

  if (loading) return <p>Loading DAG...</p>;
  if (!dagData) return <p>Error: No DAG data available.</p>;

  return <div ref={containerRef} style={sigmaStyle}></div>;
}

export default DAGSugiDev;
