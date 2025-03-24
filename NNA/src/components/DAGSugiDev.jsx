import { useEffect, useRef, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import Sigma from "sigma";
import { EdgeArrowProgram } from "sigma/rendering";
import { EdgeCurvedArrowProgram } from "@sigma/edge-curve";
import sugiyamaLayout from "./dagComps/sugiyamaLayout";

const sigmaStyle = { height: "500px", width: "1000px" };

const createGraphSugiyama = (graph, data) => {
  if (!data || !data.Graph || !data.Graph.nodes || !data.Graph.edges) {
    console.error("createGraphSugiyama: Invalid graphData.");
    return;
  }

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
      label: `${type.toUpperCase()}`,
      size: params?.weights ? 20 + params.weights.flat().length : 15,
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

function DAGSugi({ graphData, onNodeClick }) {
  const containerRef = useRef(null);
  const sigmaInstanceRef = useRef(null);

  useEffect(() => {
    if (!graphData) return; // Only process if graphData exists
    const graph = new MultiDirectedGraph();
    createGraphSugiyama(graph, graphData);

    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "curve",
      hideLabelsOnMove: false,
      allowInvalidContainer: true,
      labelDensity: 10,
      edgeProgramClasses: { curve: EdgeCurvedArrowProgram },
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

    return () => renderer.kill();
  }, [graphData, onNodeClick]);

  return <div ref={containerRef} style={sigmaStyle}></div>;
}

export default DAGSugi;
