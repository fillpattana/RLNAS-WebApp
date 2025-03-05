// const topologicalSort = (graphData) => {
//   const inDegree = new Map(); // Tracks in-degree of each node
//   const layerAssignments = new Map(); // Stores the layer assignment for each node
//   const queue = [];
//   let currentLayer = 0;

//   console.log("Starting topological sort...");

//   // Initialize in-degree map
//   graphData.Graph.nodes.forEach((node, index) => {
//     inDegree.set(index, 0); // Initially set all in-degrees to 0
//     console.log(`Node ${index} (${node.type}) initialized with in-degree 0.`);
//   });

//   // Calculate in-degree of each node by counting incoming edges
//   graphData.Graph.edges.senders.forEach((sender, idx) => {
//     const receiver = graphData.Graph.edges.receivers[idx];
//     inDegree.set(receiver, inDegree.get(receiver) + 1);
//     console.log(
//       `Edge from Node ${sender} to Node ${receiver}. Incremented in-degree of Node ${receiver} to ${inDegree.get(
//         receiver
//       )}.`
//     );
//   });

//   // Start with nodes that have in-degree 0 (no incoming edges)
//   inDegree.forEach((degree, node) => {
//     if (degree === 0) {
//       queue.push(node);
//       layerAssignments.set(node, currentLayer); // Assign these nodes to the first layer
//       console.log(
//         `Node ${node} has in-degree 0. Assigned to layer ${currentLayer}.`
//       );
//     }
//   });

//   // Process the graph in layers
//   while (queue.length > 0) {
//     const nextLayer = [];
//     currentLayer++;

//     console.log(
//       `Processing Layer ${currentLayer - 1}. Queue contains nodes: ${queue.join(
//         ", "
//       )}`
//     );

//     // Process each node in the current queue (current layer)
//     while (queue.length > 0) {
//       const node = queue.shift();
//       console.log(`Processing Node ${node} from current layer.`);

//       // Reduce the in-degree of the neighboring nodes (nodes it points to)
//       graphData.Graph.edges.senders.forEach((sender, idx) => {
//         const receiver = graphData.Graph.edges.receivers[idx];
//         if (sender === node) {
//           inDegree.set(receiver, inDegree.get(receiver) - 1);
//           console.log(
//             `Edge from Node ${node} to Node ${receiver}. Decreased in-degree of Node ${receiver} to ${inDegree.get(
//               receiver
//             )}.`
//           );
//           if (inDegree.get(receiver) === 0) {
//             nextLayer.push(receiver); // Add to the next layer when in-degree becomes 0
//             layerAssignments.set(receiver, currentLayer); // Assign it to the next layer
//             console.log(
//               `Node ${receiver} added to the next layer ${currentLayer}.`
//             );
//           }
//         }
//       });
//     }

//     // Move to the next layer of nodes
//     queue.push(...nextLayer);
//     console.log(
//       `Layer ${currentLayer - 1} completed. Next layer nodes: ${nextLayer.join(
//         ", "
//       )}`
//     );
//   }

//   // Group nodes by layers
//   const layers = new Map();
//   layerAssignments.forEach((layer, node) => {
//     if (!layers.has(layer)) {
//       layers.set(layer, []);
//     }
//     layers.get(layer).push(node); // Group nodes by their layer
//   });

//   // Log nodes in each layer
//   console.log("Nodes grouped by layers:");
//   layers.forEach((nodes, layer) => {
//     console.log(`Layer ${layer}: Nodes [${nodes.join(", ")}]`);
//   });

//   console.log(
//     "Topological sort completed. Layer assignments:",
//     layerAssignments
//   );
//   return layerAssignments;
// };

// export default topologicalSort;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// No detailed loggings of whole process.

const topologicalSort = (graphData) => {
  const inDegree = new Map(); // Tracks in-degree of each node
  const layerAssignments = new Map(); // Stores the layer assignment for each node
  const queue = [];
  let currentLayer = 0;

  // Initialize in-degree map
  graphData.Graph.nodes.forEach((node, index) => {
    inDegree.set(index, 0); // Initially set all in-degrees to 0
  });

  // Calculate in-degree of each node by counting incoming edges
  graphData.Graph.edges.senders.forEach((sender, idx) => {
    const receiver = graphData.Graph.edges.receivers[idx];
    inDegree.set(receiver, inDegree.get(receiver) + 1);
  });

  // Start with nodes that have in-degree 0 (no incoming edges)
  inDegree.forEach((degree, node) => {
    if (degree === 0) {
      queue.push(node);
      layerAssignments.set(node, currentLayer); // Assign these nodes to the first layer
    }
  });

  // Process the graph in layers
  while (queue.length > 0) {
    const nextLayer = [];
    currentLayer++;

    // Process each node in the current queue (current layer)
    while (queue.length > 0) {
      const node = queue.shift();

      // Reduce the in-degree of the neighboring nodes (nodes it points to)
      graphData.Graph.edges.senders.forEach((sender, idx) => {
        const receiver = graphData.Graph.edges.receivers[idx];
        if (sender === node) {
          inDegree.set(receiver, inDegree.get(receiver) - 1);
          if (inDegree.get(receiver) === 0) {
            nextLayer.push(receiver); // Add to the next layer when in-degree becomes 0
            layerAssignments.set(receiver, currentLayer); // Assign it to the next layer
          }
        }
      });
    }

    // Move to the next layer of nodes
    queue.push(...nextLayer);
  }

  // Group nodes by layers
  const layers = new Map();
  layerAssignments.forEach((layer, node) => {
    if (!layers.has(layer)) {
      layers.set(layer, []);
    }
    layers.get(layer).push(node); // Group nodes by their layer
  });

  return layerAssignments;
};

export default topologicalSort;
