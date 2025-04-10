import { describe, it, expect, vi } from "vitest";
import { fetchOverallAccuracyData } from "./fetchOverallAccuracyData";

global.fetch = vi.fn();

describe("fetchOverallAccuracyData", () => {
  it("transforms API data correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        agent1: {
          EPISODE1: 1000000,
          EPISODE2: 2000000,
        },
        agent2: {
          EPISODE1: 300000,
          EPISODE2: null,
        },
      }),
    });

    const { transformedData, agentNames } = await fetchOverallAccuracyData(
      "timestamp123"
    );

    expect(transformedData).toEqual([
      { episodeNum: 1, agent1: 1000000, agent2: 300000 },
      { episodeNum: 2, agent1: 2000000, agent2: null },
    ]);

    expect(agentNames).toEqual(["agent1", "agent2"]);
  });

  it("throws on failed fetch", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchOverallAccuracyData("timestamp123")).rejects.toThrow(
      /API call failed/
    );
  });
});
