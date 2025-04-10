import { describe, it, expect, vi, beforeEach } from "vitest";
import { createGraphSugiyama } from "./createGraphSugiyama";
import { MultiDirectedGraph } from "graphology";

// Mock the layout module
vi.mock("../../components/dagComps/sugiyamaLayout", () => ({
  default: () => ({
    layerAssignments: new Map([
      [0, 0],
      [1, 1],
      [2, 2],
    ]),
    nodePositions: new Map([
      [0, 0],
      [1, 1],
      [2, 2],
    ]),
  }),
}));

describe("createGraphSugiyama", () => {
  let graph;

  beforeEach(() => {
    graph = new MultiDirectedGraph();
  });

  it("adds nodes and edges correctly from valid graphData", () => {
    const data = {
      Graph: {
        nodes: [
          { index: 0, type: "input", params: {} },
          { index: 1, type: "dense", params: {} },
          { index: 2, type: "conv", params: {} },
        ],
        edges: {
          senders: [0, 1],
          receivers: [1, 2],
        },
      },
    };

    createGraphSugiyama(graph, data);

    expect(graph.order).toBe(3); // number of nodes
    expect(graph.size).toBe(2); // number of edges

    expect(graph.hasNode("0")).toBe(true);
    expect(graph.hasNode("1")).toBe(true);
    expect(graph.hasNode("2")).toBe(true);

    const nodeAttrs = graph.getNodeAttributes("1");
    expect(nodeAttrs.x).toBe(100);
    expect(nodeAttrs.y).toBe(50);
    expect(nodeAttrs.color).toBe("#4065fa"); // dense node

    const edgeAttrs = graph.getEdgeAttributes("edge0");
    expect(edgeAttrs.label).toBe("Edge 0-1");
    expect(edgeAttrs.color).toBe("#4FA4F0");
  });

  it("handles missing graphData gracefully", () => {
    const result = createGraphSugiyama(graph, null);
    expect(result).toBeUndefined();
    expect(graph.order).toBe(0);
  });

  it("skips edges with missing nodes", () => {
    const data = {
      Graph: {
        nodes: [{ index: 0, type: "input", params: {} }],
        edges: {
          senders: [0, 1],
          receivers: [1, 2],
        },
      },
    };

    createGraphSugiyama(graph, data);

    expect(graph.order).toBe(1);
    expect(graph.size).toBe(0); // no valid edges
  });
});
