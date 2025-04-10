import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  fetchAgentCount,
  fetchEpisodeCount,
  fetchIterationCount,
  fetchGraphData,
} from "./agentPageFetchers";

const mockTimestamp = "2025-04-10T00:00:00Z";

describe("agentPageFetchers", () => {
  beforeEach(() => {
    vi.restoreAllMocks(); // reset fetch mocks
  });

  it("fetchAgentCount returns agent list", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ totalagents: 3 }),
    });

    const result = await fetchAgentCount(mockTimestamp);
    expect(result).toEqual([
      { id: "Agent 0", name: "Agent 0" },
      { id: "Agent 1", name: "Agent 1" },
      { id: "Agent 2", name: "Agent 2" },
    ]);
  });

  it("fetchAgentCount returns [] if totalagents is missing", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const result = await fetchAgentCount(mockTimestamp);
    expect(result).toEqual([]);
  });

  it("fetchEpisodeCount returns episodes", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ totalepisodes: 2 }),
    });

    const result = await fetchEpisodeCount(mockTimestamp, "0");
    expect(result).toEqual([{ name: "Episode 0" }, { name: "Episode 1" }]);
  });

  it("fetchIterationCount returns total iterations", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ totaliterations: 5 }),
    });

    const result = await fetchIterationCount(mockTimestamp, "0", "0");
    expect(result).toBe(5);
  });

  it("fetchGraphData returns nodes, edges and hyperlink", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ nodes: [], edges: [], hyperlink: [] }),
    });

    const result = await fetchGraphData(mockTimestamp, "0", "0", "0");
    expect(result).toEqual({ nodes: [], edges: [], hyperlink: [] });
  });

  //   it("fetchGraphData returns null on error", async () => {
  //     vi.spyOn(global, "fetch").mockResolvedValueOnce({
  //       ok: false,
  //       status: 500,
  //       json: async () => ({}),
  //     });

  //     const result = await fetchGraphData(mockTimestamp, "0", "0", "0");
  //     expect(result).toBeNull();
  //   });
});
