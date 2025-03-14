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
