const topologicalSort = (graphData) => {
  if (
    !graphData ||
    !graphData.Graph ||
    !graphData.Graph.nodes ||
    !graphData.Graph.edges
  ) {
    console.warn("Invalid or empty graphData provided to topologicalSort.");
    return new Map(); // Return empty map to prevent crashes
  }

  const inDegree = new Map();
  const layerAssignments = new Map();
  const queue = [];
  let currentLayer = 0;

  graphData.Graph.nodes.forEach((_, index) => {
    inDegree.set(index, 0);
  });

  if (graphData.Graph.edges.senders && graphData.Graph.edges.receivers) {
    graphData.Graph.edges.senders.forEach((sender, idx) => {
      const receiver = graphData.Graph.edges.receivers[idx];
      inDegree.set(receiver, (inDegree.get(receiver) || 0) + 1);
    });
  }

  inDegree.forEach((degree, node) => {
    if (degree === 0) {
      queue.push(node);
      layerAssignments.set(node, currentLayer);
    }
  });

  while (queue.length > 0) {
    const nextLayer = [];
    currentLayer++;

    while (queue.length > 0) {
      const node = queue.shift();

      graphData.Graph.edges.senders.forEach((sender, idx) => {
        const receiver = graphData.Graph.edges.receivers[idx];
        if (sender === node) {
          inDegree.set(receiver, inDegree.get(receiver) - 1);
          if (inDegree.get(receiver) === 0) {
            nextLayer.push(receiver);
            layerAssignments.set(receiver, currentLayer);
          }
        }
      });
    }

    queue.push(...nextLayer);
  }

  return layerAssignments;
};

const barycenterOrdering = (graphData, layerAssignments) => {
  if (
    !graphData ||
    !graphData.Graph ||
    !graphData.Graph.nodes ||
    !graphData.Graph.edges
  ) {
    console.warn("Invalid or empty graphData provided to barycenterOrdering.");
    return new Map(); // Return empty map
  }

  const layers = new Map();
  const nodePositions = new Map();

  layerAssignments.forEach((layer, node) => {
    if (!layers.has(layer)) {
      layers.set(layer, []);
    }
    layers.get(layer).push(node);
  });

  layers.forEach((nodes, layer) => {
    const nodeBarycenters = nodes.map((node) => {
      const neighbors = [];

      if (graphData.Graph.edges.senders && graphData.Graph.edges.receivers) {
        graphData.Graph.edges.senders.forEach((sender, idx) => {
          const receiver = graphData.Graph.edges.receivers[idx];
          if (sender === node) {
            neighbors.push(layerAssignments.get(receiver) || 0);
          } else if (receiver === node) {
            neighbors.push(layerAssignments.get(sender) || 0);
          }
        });
      }

      const barycenter = neighbors.length
        ? neighbors.reduce((sum, pos) => sum + pos, 0) / neighbors.length
        : 0;

      return { node, barycenter };
    });

    nodeBarycenters.sort((a, b) => a.barycenter - b.barycenter);

    nodeBarycenters.forEach(({ node }, index) => {
      nodePositions.set(node, index);
    });
  });

  return nodePositions;
};

const sugiyamaLayout = (graphData) => {
  if (
    !graphData ||
    !graphData.Graph ||
    !graphData.Graph.nodes ||
    !graphData.Graph.edges
  ) {
    console.warn("Invalid or empty graphData provided to sugiyamaLayout.");
    return { layerAssignments: new Map(), nodePositions: new Map() }; // Prevent crashes
  }

  const layerAssignments = topologicalSort(graphData);
  const nodePositions = barycenterOrdering(graphData, layerAssignments);
  return { layerAssignments, nodePositions };
};

export default sugiyamaLayout;
