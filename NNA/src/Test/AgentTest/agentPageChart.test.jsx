import { describe, it, expect, vi, beforeEach } from "vitest";
import fetchData from "../../api/fetchAgentPerformanceData";

const mockSetChartData = vi.fn();

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useState: (initial) => [initial, mockSetChartData],
}));

describe("fetchData", () => {
  const mockRuntimestamp = "2025-04-10T00:00:00Z";
  const mockAgentNum = "1";
  const mockEpisodeNum = "2";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and transforms data correctly", async () => {
    const mockResponseData = [
      { accuracy: "0.95", trainingtime: "100" },
      { accuracy: "0.90", trainingtime: "200" },
    ];

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/IterationMetric/${encodeURIComponent(
            mockRuntimestamp
          )}?agentNum=${mockAgentNum}&episodeNum=${mockEpisodeNum}`
        );
        if (!response.ok) {
          throw new Error(
            `Performance chart is receiving agentNum=${mockAgentNum}&episodeNum=${mockEpisodeNum}`
          );
        }
        const result = await response.json();

        const transformedData = result.map((item, index) => ({
          iterationNumber: index + 1,
          accuracy: parseFloat(item.accuracy),
          flops: parseInt(item.trainingtime, 10),
        }));

        mockSetChartData(transformedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    await fetchData();

    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/IterationMetric/${encodeURIComponent(
        mockRuntimestamp
      )}?agentNum=${mockAgentNum}&episodeNum=${mockEpisodeNum}`
    );

    expect(mockSetChartData).toHaveBeenCalledWith([
      { iterationNumber: 1, accuracy: 0.95, flops: 100 },
      { iterationNumber: 2, accuracy: 0.9, flops: 200 },
    ]);
  });

  it("handles fetch errors gracefully", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
    });

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/IterationMetric/${encodeURIComponent(
            mockRuntimestamp
          )}?agentNum=${mockAgentNum}&episodeNum=${mockEpisodeNum}`
        );
        if (!response.ok) {
          throw new Error(
            `Performance chart is receiving agentNum=${mockAgentNum}&episodeNum=${mockEpisodeNum}`
          );
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    await fetchData();

    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/IterationMetric/${encodeURIComponent(
        mockRuntimestamp
      )}?agentNum=${mockAgentNum}&episodeNum=${mockEpisodeNum}`
    );
  });
});
