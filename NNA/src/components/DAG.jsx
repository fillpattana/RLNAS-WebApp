import { useEffect, useRef, useState } from "react";
import { MultiDirectedGraph } from "graphology";
import { Sigma } from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import nodeData from "../assets/nodeData.json";
import nodeDataConv from "../assets/nodeDataWithConv.json";

const sigmaStyle = { height: "800px", width: "800px" };

// No Layout + Fully Connected Only
// export const LoadMultiDirectedGraph = (sigmaInstance) => {
//   useEffect(() => {
//     const graph = new MultiDirectedGraph();

//     // Add nodes
//     nodeData.Graph.nodes.forEach((node, index) => {
//       graph.addNode(index.toString(), {
//         label: `Node ${index}: ${node.type}`,
//         size: 15 + node.weights[0].length, // Adjust size based on number of weights
//         x: Math.random(),
//         y: Math.random(),
//         color: "#FA4F40",
//       });
//     });

//     // Add edges
//     nodeData.Graph.edges.senders.forEach((sender, idx) => {
//       const receiver = nodeData.Graph.edges.receivers[idx];
//       if (
//         graph.hasNode(sender.toString()) &&
//         graph.hasNode(receiver.toString())
//       ) {
//         graph.addEdgeWithKey(
//           `edge${idx}`,
//           sender.toString(),
//           receiver.toString(),
//           {
//             label: `Edge ${sender}-${receiver}`,
//             color: "#4FA4F0",
//           }
//         );
//       }
//     });

//     // Load the graph into the sigma instance
//     sigmaInstance.setGraph(graph);
//   }, [sigmaInstance]);

//   return null;
// };

// Library Node Auto Layout With Conv
export const LoadLibLayoutGraph2 = (sigmaInstance) => {
  useEffect(() => {
    const graph = new MultiDirectedGraph();

    // Add nodes
    nodeDataConv.Graph.nodes.forEach((node, index) => {
      let color = "#68696c"; // Default color

      if (node.type === "fully connected") {
        color = "#4065fa";
      } else if (node.type === "convolutional") {
        color = "#FA4F40";
      }

      // Add the node to the graph
      graph.addNode(index.toString(), {
        label: `Node ${index}: ${node.type}`,
        size: node.params.weights.flat().length + 10,
        x: Math.random(),
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
          }
        );
      }
    });

    // Apply ForceAtlas2 layout
    forceAtlas2.assign(graph, {
      iterations: 50,
      settings: { gravity: 1, scalingRatio: 2 },
    });

    // Load the graph into the sigma instance
    sigmaInstance.setGraph(graph);
  }, [sigmaInstance]);

  return null;
};

// Drag and Drop
export const DragandDrop = (sigmaInstance) => {
  const [draggedNode, setDraggedNode] = useState(null);

  useEffect(() => {
    const graph = sigmaInstance.getGraph();

    const handleDownNode = (event) => {
      setDraggedNode(event.node);
      graph.setNodeAttribute(event.node, "highlighted", true);
    };

    const handleMousemove = (event) => {
      if (!draggedNode) return;

      const pos = sigmaInstance.viewportToGraph(event);
      graph.setNodeAttribute(draggedNode, "x", pos.x);
      graph.setNodeAttribute(draggedNode, "y", pos.y);

      event.preventDefault();
    };

    const handleMouseup = () => {
      if (draggedNode) {
        graph.removeNodeAttribute(draggedNode, "highlighted");
        setDraggedNode(null);
      }
    };

    sigmaInstance.on("downNode", handleDownNode);
    window.addEventListener("mousemove", handleMousemove);
    window.addEventListener("mouseup", handleMouseup);

    return () => {
      sigmaInstance.removeListener("downNode", handleDownNode);
      window.removeEventListener("mousemove", handleMousemove);
      window.removeEventListener("mouseup", handleMouseup);
    };
  }, [sigmaInstance, draggedNode]);

  return null;
};

// Main DAG Component
function DAG() {
  const containerRef = useRef(null);
  const sigmaInstanceRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const graph = new MultiDirectedGraph();
      sigmaInstanceRef.current = new Sigma(graph, containerRef.current);

      // Clean up when component unmounts
      return () => {
        sigmaInstanceRef.current.kill();
      };
    }
  }, []);

  const sigmaInstance = sigmaInstanceRef.current;

  return (
    <div ref={containerRef} style={sigmaStyle}>
      {sigmaInstance && (
        <>
          <LoadLibLayoutGraph2 sigmaInstance={sigmaInstance} />
          <DragandDrop sigmaInstance={sigmaInstance} />
        </>
      )}
    </div>
  );
}

export default DAG;
