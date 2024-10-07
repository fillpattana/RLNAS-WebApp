// LIBS
import { useEffect, useRef, useMemo, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import Sigma from "sigma";
import { EdgeCurvedArrowProgram } from "@sigma/edge-curve";
import { EdgeArrowProgram } from "sigma/rendering";
import forceAtlas2 from "graphology-layout-forceatlas2";
// SAMPS
import nodeData from "../assets/nodeData.json"; //first sample with only fully connected
import nodeDataWithConv from "../assets/nodeDataWithConv.json"; //Second sample that includes conv, only 2 nodes.
import nodeDataWithConv2 from "../assets/nodeDataWithConv2.json"; //modified sample with more layer varieties and nodes.
import nodeDataWithConv3 from "../assets/nodeDataWithConv3.json"; //modified sample with more nodes in same layer and nodes.
// COMPS
import topSort from "./dagComps/topologicalSort";

//Sigma canvas = size of canvas for graph to be drawn
const sigmaStyle = { height: "500px", width: "500px" };

// Function for graph init for lib layouts
// const createGraph1 = (graph, data) => {
//   // add nodes
//   data.Graph.nodes.forEach((node, index) => {
//     graph.addNode(index.toString(), {
//       label: `Node ${index}: ${node.type}`,
//       size: 15 + node.params.weights.flat().length,
//       x: Math.random() * 10, // Spread out the nodes more
//       y: Math.random() * 10,
//       color: node.type === "fully connected" ? "#4065fa" : "#FA4F40",
//     });
//   });

//   // add edges
//   data.Graph.edges.senders.forEach((sender, idx) => {
//     const receiver = data.Graph.edges.receivers[idx];
//     if (
//       graph.hasNode(sender.toString()) &&
//       graph.hasNode(receiver.toString())
//     ) {
//       graph.addEdgeWithKey(
//         `edge${idx}`,
//         sender.toString(),
//         receiver.toString(),
//         {
//           label: `Edge ${sender}-${receiver}`,
//           color: "#4FA4F0",
//           size: 3,
//         }
//       );
//     }
//   });
// };

// Function for graph init with top sort potentially the default layout
const createGraph2 = (graph, data, topSortLayout) => {
  // add nodes by layers
  data.Graph.nodes.forEach((node, index) => {
    const layer = topSortLayout.get(index);
    graph.addNode(index.toString(), {
      label: `Node ${index}`,
      size: 15 + node.params.weights.flat().length,
      x: layer * 100, // Spread horizontally by layer
      y: index * 50, // vertical spacings
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

function DAG({ onNodeClick }) {
  const containerRef = useRef(null); //stores the HTML where the sigma graph will be drawn
  const sigmaInstanceRef = useRef(null); //stores the graph itself (change graph UI here)
  const [graphData, setGraphData] = useState(nodeDataWithConv3); //preparation for realtime updates

  // Memoize top sort layout to only recalculate when data changes
  const topSortLayout = useMemo(() => {
    console.log("Recomputing layers");
    return topSort(graphData);
  }, [graphData]);

  useEffect(() => {
    const graph = new MultiDirectedGraph();

    // // Init graph type and pass json doc for graph's data
    // createGraph1(graph, nodeDataWithConv2);

    // // Init a sigma instance
    // const renderer = new Sigma(graph, containerRef.current, {
    //   defaultEdgeType: "curve", // Enable curved edges
    //   edgeProgramClasses: { curve: EdgeCurvedArrowProgram },
    // });

    // // Apply ForceAtlas2 layout to spread nodes out
    // forceAtlas2.assign(graph, {
    //   iterations: 200,
    //   settings: { gravity: 1, scalingRatio: 5 },
    // });

    //-----------------with top sort layout-----------------//

    // Init graph type and pass json doc for graph's data
    createGraph2(graph, graphData, topSortLayout);

    // Init a sigma instance
    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "curve", // Enable curved edges
      edgeProgramClasses: { curve: EdgeCurvedArrowProgram },
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

    sigmaInstanceRef.current = renderer;

    // Clean up when the component unmounts
    return () => {
      renderer.kill();
    };
  }, [onNodeClick]);

  return <div ref={containerRef} style={sigmaStyle}></div>; //returning div for SigmaJs=direct physical manipulation of the graph's canvas
}

export default DAG;
