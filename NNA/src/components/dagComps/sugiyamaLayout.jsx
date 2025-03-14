const topologicalSort = (graphData) => {
  // console.log("beginning TopSort\n");
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

const barycenterOrdering = (graphData, layerAssignments) => {
  // console.log("beginning BaryCenter");
  const layers = new Map();
  const nodePositions = new Map();

  // Group nodes by layers
  layerAssignments.forEach((layer, node) => {
    if (!layers.has(layer)) {
      layers.set(layer, []);
    }
    layers.get(layer).push(node);
  });

  // Calculate barycenters and sort nodes in each layer
  layers.forEach((nodes, layer) => {
    const nodeBarycenters = nodes.map((node) => {
      const neighbors = [];

      // Loop through edges using senders and receivers arrays
      graphData.Graph.edges.senders.forEach((sender, idx) => {
        const receiver = graphData.Graph.edges.receivers[idx];
        if (sender === node) {
          neighbors.push(layerAssignments.get(receiver));
        } else if (receiver === node) {
          neighbors.push(layerAssignments.get(sender));
        }
      });

      // Calculate barycenter as the average of neighboring layer positions
      const barycenter =
        neighbors.reduce((sum, pos) => sum + pos, 0) / neighbors.length;

      return { node, barycenter };
    });

    // Sort nodes based on barycenter values
    nodeBarycenters.sort((a, b) => a.barycenter - b.barycenter);

    // Update node positions in the layer
    nodeBarycenters.forEach(({ node }, index) => {
      nodePositions.set(node, index);
    });
  });

  return nodePositions;
};

const sugiyamaLayout = (graphData) => {
  const layerAssignments = topologicalSort(graphData);
  const nodePositions = barycenterOrdering(graphData, layerAssignments);
  return { layerAssignments, nodePositions };
};

export default sugiyamaLayout;
