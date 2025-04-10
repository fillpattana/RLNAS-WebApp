import sugiyamaLayout from "../../components/dagComps/sugiyamaLayout";

export function createGraphSugiyama(graph, data) {
  if (!data || !data.Graph || !data.Graph.nodes || !data.Graph.edges) {
    console.error("createGraphSugiyama: Invalid graphData.");
    return;
  }

  const { layerAssignments, nodePositions } = sugiyamaLayout(data);

  data.Graph.nodes.forEach((node) => {
    const { index, type, params } = node;
    const layer = layerAssignments.get(index);
    const position = nodePositions.get(index);

    if (layer === undefined || position === undefined) {
      console.error(`Layer or position undefined for node ${index}`);
      return;
    }

    graph.addNode(index.toString(), {
      size: 20,
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
}
