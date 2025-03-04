import { useEffect, useRef, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import Sigma from "sigma";
import { EdgeCurvedArrowProgram } from "@sigma/edge-curve";
import { EdgeArrowProgram } from "sigma/rendering";
import nodeDataSamp2 from "../assets/nodeDataSamp2.json";
import sugiyamaLayout from "./dagComps/sugiyamaLayout";

const sigmaStyle = { height: "500px", width: "1000px" };

// Function to initialize graph with Sugiyama layout applied
const createGraphSugiyama = (graph, data) => {
  console.log("createGraphSugiyama called");

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

function DAGSugi({ onNodeClick }) {
  const containerRef = useRef(null);
  const sigmaInstanceRef = useRef(null);
  const [graphData, setGraphData] = useState(nodeDataSamp2);
  const hasMountedRef = useRef(false); // Track if component has mounted before

  useEffect(() => {
    const graph = new MultiDirectedGraph();

    // Only initialize the graph on the first mount
    if (!hasMountedRef.current) {
      createGraphSugiyama(graph, graphData);
      hasMountedRef.current = true;
    }

    // Initialize Sigma instance
    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "curve",
      edgeProgramClasses: { curve: EdgeCurvedArrowProgram },
      hideLabelsOnMove: false,
      allowInvalidContainer: true,
      labelDensity: 10,
    });

    // Handle node click event
    renderer.on(
      "clickNode",
      (event) => {
        const clickedNodeId = event.node;
        const nodeData = graphData.Graph.nodes.find(
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
      },
      { passive: true }
    );

    // Drag and drop functionality
    let draggedNode = null;
    let isDragging = false;

    renderer.on("downNode", (e) => {
      isDragging = true;
      draggedNode = e.node;
      graph.setNodeAttribute(draggedNode, "highlighted", true);
    });

    renderer.getMouseCaptor().on(
      "mousemovebody",
      (e) => {
        if (!isDragging || !draggedNode) return;

        const pos = renderer.viewportToGraph(e);

        graph.setNodeAttribute(draggedNode, "x", pos.x);
        graph.setNodeAttribute(draggedNode, "y", pos.y);

        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      { passive: true }
    );

    renderer.getMouseCaptor().on("mouseup", () => {
      if (draggedNode) {
        graph.removeNodeAttribute(draggedNode, "highlighted");
      }
      isDragging = false;
      draggedNode = null;
    });

    renderer.getMouseCaptor().on("mousedown", () => {
      if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
    });

    renderer.on("enterNode", () => {
      containerRef.current.style.cursor = "pointer";
    });

    renderer.on("leaveNode", () => {
      containerRef.current.style.cursor = "default";
    });

    sigmaInstanceRef.current = renderer;

    return () => {
      console.log("Component Unmounts");
      renderer.kill();
      hasMountedRef.current = false;
    };
  }, [onNodeClick]);

  return <div ref={containerRef} style={sigmaStyle}></div>;
}

export default DAGSugi;
