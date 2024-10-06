import { useEffect, useRef } from "react";
import { MultiDirectedGraph } from "graphology";
import Sigma from "sigma";
import { EdgeCurvedArrowProgram } from "@sigma/edge-curve";
import forceAtlas2 from "graphology-layout-forceatlas2";
import nodeData from "../assets/nodeData.json"; //first sample with only fully connected
import nodeDataWithConv from "../assets/nodeDataWithConv.json"; //Second sample that includes conv, only 2 nodes.
import nodeDataWithConv2 from "../assets/nodeDataWithConv2.json"; //modified sample with more layer varieties and nodes.

//Sigma canvas = size of canvas for graph to be drawn
const sigmaStyle = { height: "500px", width: "500px" };

// Function for graph initialization
const createGraph = (graph, data) => {
  // ddd nodes
  nodeDataWithConv2.Graph.nodes.forEach((node, index) => {
    graph.addNode(index.toString(), {
      label: `Node ${index}: ${node.type}`,
      size: 15 + node.params.weights.flat().length,
      x: Math.random() * 10, // Spread out the nodes more
      y: Math.random() * 10,
      color: node.type === "fully connected" ? "#4065fa" : "#FA4F40",
    });
  });

  // add edges
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
    }
  });
};

function DAG() {
  const containerRef = useRef(null); //stores the HTML where the sigma graph will be drawn
  const sigmaInstanceRef = useRef(null); //stores the graph itself (change graph UI here)

  useEffect(() => {
    const graph = new MultiDirectedGraph();

    // Init graph type and pass json doc for graph's data
    createGraph(graph, nodeDataWithConv2);

    // Init a sigma instance
    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "curve", // Enable curved edges
      edgeProgramClasses: { curve: EdgeCurvedArrowProgram },
    });

    // Apply ForceAtlas2 layout to spread nodes out
    forceAtlas2.assign(graph, {
      iterations: 200,
      settings: { gravity: 1, scalingRatio: 5 },
    });

    sigmaInstanceRef.current = renderer;

    // Clean up when the component unmounts
    return () => {
      renderer.kill();
    };
  }, []);

  return <div ref={containerRef} style={sigmaStyle}></div>; //returning div for SigmaJs=direct physical manipulation of the graph's canvas
}

export default DAG;
