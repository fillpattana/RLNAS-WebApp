import { describe, it, expect } from "vitest";
import sugiyamaLayout from "../../components/dagComps/sugiyamaLayout";
import {
  topologicalSort,
  barycenterOrdering,
} from "../../components/dagComps/sugiyamaLayout";

const sampleGraph = {
  Graph: {
    nodes: [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }],
    edges: {
      senders: [0, 0, 1],
      receivers: [1, 2, 3],
    },
  },
};

describe("topologicalSort", () => {
  it("assigns correct layers in topological order", () => {
    const layers = topologicalSort(sampleGraph);
    expect(layers.get(0)).toBe(0); // Input node
    expect(layers.get(1)).toBe(1);
    expect(layers.get(2)).toBe(1);
    expect(layers.get(3)).toBe(2);
  });
});

describe("barycenterOrdering", () => {
  it("assigns correct horizontal order within layers", () => {
    const layers = topologicalSort(sampleGraph);
    const positions = barycenterOrdering(sampleGraph, layers);
    expect(positions.has(1)).toBe(true);
    expect(positions.has(2)).toBe(true);
    expect(positions.has(3)).toBe(true);
  });
});

describe("sugiyamaLayout", () => {
  it("returns valid layout maps", () => {
    const layout = sugiyamaLayout(sampleGraph);
    expect(layout.layerAssignments).toBeInstanceOf(Map);
    expect(layout.nodePositions).toBeInstanceOf(Map);
    expect(layout.layerAssignments.size).toBeGreaterThan(0);
    expect(layout.nodePositions.size).toBeGreaterThan(0);
  });

  it("handles invalid graphData safely", () => {
    const layout = sugiyamaLayout(null);
    expect(layout.layerAssignments.size).toBe(0);
    expect(layout.nodePositions.size).toBe(0);
  });
});
