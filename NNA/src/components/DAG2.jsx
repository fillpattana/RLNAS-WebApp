import { useEffect, useRef, useMemo, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import Sigma from "sigma";
import { EdgeCurvedArrowProgram } from "@sigma/edge-curve";
import { EdgeArrowProgram } from "sigma/rendering";
import nodeDataWithConv3 from "../assets/nodeDataWithConv3.json";
import nodeDataSamp1 from "../assets/nodeDataSamp1.json";
import sugiyamaLayout from "./dagComps/sugiyamaLayout";

const sigmaStyle = { height: "50vh", width: "100vh" };

// Function for graph init with Sugiyama layout applied
const createGraph = (graph, data, sugiyamaLayoutResult) => {
  const { layerAssignments, nodePositions } = sugiyamaLayoutResult;

  // Add nodes by layers and positions
  data.Graph.nodes.forEach((node, index) => {
    const layer = layerAssignments.get(index);
    const position = nodePositions.get(index);

    // Handle layer and node calculation failures
    if (layer === undefined || position === undefined) {
      console.error(`Layer or position undefined for node ${index}`);
      return;
    }

    graph.addNode(index.toString(), {
      label: `Node ${index}`,
      size: 15 + node.params.weights.flat().length,
      x: layer * 100, // Spread horizontally by layer
      y: position * 50, // Spread vertically by the node's position within the layer
      color: node.type === "fully connected" ? "#4065fa" : "#FA4F40",
    });
  });

  // Add edges
  if (data.Graph.edges.senders && data.Graph.edges.receivers) {
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
  } else {
    console.error("Edges data is missing senders or receivers");
  }
};

function DAG({ onNodeClick }) {
  const containerRef = useRef(null); // stores the HTML where the sigma graph will be drawn
  const sigmaInstanceRef = useRef(null); // stores the graph itself (change graph UI here)
  const [graphData, setGraphData] = useState(nodeDataSamp1); // preparation for real-time updates
  const [sugiyamaApplied, setSugiyamaApplied] = useState(false); // Track if Sugiyama has been applied

  useEffect(() => {
    const graph = new MultiDirectedGraph();

    // Run Sugiyama layout on the graph data
    const sugiyamaLayoutResult = sugiyamaLayout(graphData);

    // Init graph with Sugiyama layout results
    createGraph(graph, graphData, sugiyamaLayoutResult);

    // Init a sigma instance
    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "curve", // Enable curved edges
      edgeProgramClasses: { curve: EdgeCurvedArrowProgram },
      hideLabelsOnMove: false,
      labelDensity: 10,
    });

    // Add event listener for clicking on nodes
    renderer.on(
      "clickNode",
      (event) => {
        const clickedNodeId = event.node;
        const nodeData = graphData.Graph.nodes[clickedNodeId];
        onNodeClick({
          id: clickedNodeId,
          type: nodeData.type,
          activation: nodeData.activation.type,
          weights: nodeData.params.weights,
          biases: nodeData.params.biases,
        });
      },
      { passive: true }
    );

    // Enable drag-and-drop without node creation
    let draggedNode = null;
    let isDragging = false;

    // On mouse down on a node: Start dragging
    renderer.on("downNode", (e) => {
      isDragging = true;
      draggedNode = e.node;
      graph.setNodeAttribute(draggedNode, "highlighted", true);
    });

    // On mouse move, change node position if dragging
    renderer.getMouseCaptor().on("mousemovebody", (e) => {
      if (!isDragging || !draggedNode) return;

      const pos = renderer.viewportToGraph(e);

      graph.setNodeAttribute(draggedNode, "x", pos.x);
      graph.setNodeAttribute(draggedNode, "y", pos.y);

      // Prevent default behaviors
      e.preventSigmaDefault();
      e.original.preventDefault();
      e.original.stopPropagation();
    });

    // On mouse up: Stop dragging and fix node position
    renderer.getMouseCaptor().on("mouseup", () => {
      if (draggedNode) {
        graph.removeNodeAttribute(draggedNode, "highlighted");
      }
      isDragging = false;
      draggedNode = null;
    });

    // Disable automatic repositioning after drag
    renderer.getMouseCaptor().on("mousedown", () => {
      if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
    });

    sigmaInstanceRef.current = renderer;

    // Clean up when the component unmounts
    return () => {
      renderer.kill();
    };
  }, [onNodeClick]);

  return <div ref={containerRef} style={sigmaStyle}></div>; // returning div for SigmaJs=direct physical manipulation of the graph's canvas
}

export default DAG;
