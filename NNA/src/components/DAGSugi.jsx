import { useEffect, useRef, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import Sigma from "sigma";
import { EdgeCurvedArrowProgram } from "@sigma/edge-curve";
import { EdgeArrowProgram } from "sigma/rendering";
import nodeDataSamp1 from "../assets/nodeDataSamp1.json";
import sugiyamaLayout from "./dagComps/sugiyamaLayout";

const sigmaStyle = { height: "500px", width: "1000px" };

// Function for graph init with Sugiyama layout applied
const createGraphSugiyama = (graph, data) => {
  console.log("creategraph called\n");
  const sugiyamaLayoutResult = sugiyamaLayout(data);
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
      x: layer * 100, //horizontal position + distance between nodes of different layers
      y: position * 50, //vertical position + distance between nodes in same layer
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

function DAGSugi({ onNodeClick }) {
  const containerRef = useRef(null);
  const sigmaInstanceRef = useRef(null);
  const [graphData, setGraphData] = useState(nodeDataSamp1);
  const hasMountedRef = useRef(false); // Track if component has mounted before

  useEffect(() => {
    const graph = new MultiDirectedGraph();

    // Only call createGraphSugiyama on the first mount or after an unmount
    if (!hasMountedRef.current) {
      createGraphSugiyama(graph, graphData);
      hasMountedRef.current = true;
    }

    // Init a sigma instance
    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "curve",
      edgeProgramClasses: { curve: EdgeCurvedArrowProgram },
      hideLabelsOnMove: false,
      allowInvalidContainer: true,
      labelDensity: 10,
    });

    //passing node properties as props to parent div for property display
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

    //drag and drop
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
