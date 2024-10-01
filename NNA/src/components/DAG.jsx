import nodeData from "../assets/nodeData.json";
import nodeDataConv from "../assets/nodeDataWithConv.json";
import { useEffect, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import {
  SigmaContainer,
  useLoadGraph,
  ControlsContainer,
  FullScreenControl,
  ZoomControl,
  useRegisterEvents,
  useSigma,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import forceAtlas2 from "graphology-layout-forceatlas2";

const sigmaStyle = { height: "800px", width: "800px" };

// No Layout + Fully Connected Only
export const LoadMultiDirectedGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new MultiDirectedGraph();

    // Add nodes
    nodeData.Graph.nodes.forEach((node, index) => {
      console.log(`Adding node ${index}`);
      graph.addNode(index.toString(), {
        label: `Node ${index}: ${node.type}`,
        size: 15 + node.weights[0].length, // Adjust size based on number of weights
        x: Math.random(),
        y: Math.random(),
        color: "#FA4F40",
      });
    });

    // Log and check before adding edges
    nodeData.Graph.edges.senders.forEach((sender, idx) => {
      const receiver = nodeData.Graph.edges.receivers[idx];
      console.log(`Adding edge from ${sender} to ${receiver}`);
      console.log(`Edge Number: ${idx}`);
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
          }
        );
      } else {
        console.error(`Node ${sender} or ${receiver} not found`);
      }
    });

    loadGraph(graph);
  }, [loadGraph]);

  return null;
};
//
//Library Node Auto Layout Without Conv
export const LoadLibLayoutGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new MultiDirectedGraph();

    // Add nodes
    nodeDataConv.Graph.nodes.forEach((node, index) => {
      graph.addNode(index.toString(), {
        label: `Node ${index}: ${node.type}`,
        size: 15 + node.params.weights[0].length,
        x: Math.random(), // Initial random positions
        y: Math.random(),
        color: "#FA4F40",
        adjustSizes: true,
      });
    });

    // Add edges
    nodeData.Graph.edges.senders.forEach((sender, idx) => {
      const receiver = nodeData.Graph.edges.receivers[idx];
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
      }
    });

    // Apply ForceAtlas2 layout
    forceAtlas2.assign(graph, {
      iterations: 50,
      settings: { gravity: 1, scalingRatio: 2 },
    });

    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

// Library Node Auto Layout With Conv
export const LoadLibLayoutGraph2 = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new MultiDirectedGraph();

    // Add nodes
    nodeDataConv.Graph.nodes.forEach((node, index) => {
      let color = "#68696c"; // Default color

      // Adjust color based on the type of the layer
      if (node.type === "fully connected") {
        color = "#4065fa";
        // size = node.params.weights.flat().length + 10;
      } else if (node.type === "convolutional") {
        color = "#FA4F40";
        // size = node.params.weights.flat().length + 10;
      }

      // Add the node to the graph
      graph.addNode(index.toString(), {
        label: `Node ${index}: ${node.type}`,
        size: node.params.weights.flat().length + 10,
        x: Math.random(), // Initial random positions
        y: Math.random(),
        color: color,
        adjustSizes: true,
      });
    });

    // Add edges
    nodeData.Graph.edges.senders.forEach((sender, idx) => {
      const receiver = nodeData.Graph.edges.receivers[idx];
      if (
        graph.hasNode(sender.toString()) &&
        graph.hasNode(receiver.toString())
      ) {
        graph.addDirectedEdgeWithKey(
          `edge${idx}`,
          sender.toString(),
          receiver.toString(),
          {
            label: `Edge ${sender}-${receiver}`,
            color: "#4FA4F0",
            size: 3,
            defaultEdgeType: "curve",
          }
        );
      }
    });

    // Apply ForceAtlas2 layout
    forceAtlas2.assign(graph, {
      iterations: 50,
      settings: { gravity: 1, scalingRatio: 2 },
    });

    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export const DragandDrop = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState(null);

  useEffect(() => {
    // Register the events
    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
      },
      // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
      mousemovebody: (e) => {
        if (!draggedNode) return;
        // Get new position of node
        const pos = sigma.viewportToGraph(e);
        sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

        // Prevent sigma to move camera:
        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      // On mouse up, we reset the autoscale and the dragging mode
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        }
      },
      // Disable the autoscale at the first down interaction
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
    });
  }, [registerEvents, sigma, draggedNode]);

  return null;
};

function DAG() {
  return (
    <SigmaContainer
      graph={MultiDirectedGraph}
      style={sigmaStyle}
      settings={{
        allowInvalidContainer: true,
      }}
    >
      {/* <LoadNormalGraph /> */}
      {/* <LoadMultiDirectedGraph /> */}
      {/* <LoadLibLayoutGraph /> */}
      <LoadLibLayoutGraph2 />
      <DragandDrop />
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl />
        <FullScreenControl />
      </ControlsContainer>
    </SigmaContainer>
  );
}

export default DAG;
