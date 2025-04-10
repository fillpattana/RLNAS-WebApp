import { vi, describe, it, expect, beforeEach } from "vitest";
import { fetchOverallLossData } from "./fetchOverallLossData";

global.fetch = vi.fn();

describe("fetchOverallLossData", () => {
  const mockTimestamp = "2023-10-01T12:00:00Z";
  const mockResponse = [
    { loss: "0.5", epoch: "1" },
    { loss: "0.3", epoch: "2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and transform data correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const setChartData = vi.fn();
    global.runtimestamp = mockTimestamp;
    global.setChartData = setChartData;

    await fetchOverallLossData();

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/LossMetric/${encodeURIComponent(
        mockTimestamp
      )}`
    );
    expect(setChartData).toHaveBeenCalledWith([
      { loss: 0.5, epoch: 1 },
      { loss: 0.3, epoch: 2 },
    ]);
  });

  it("should handle fetch errors", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    global.runtimestamp = mockTimestamp;

    await fetchOverallLossData();

    expect(consoleError).toHaveBeenCalledWith(
      "Error fetching chart data:",
      expect.any(Error)
    );

    consoleError.mockRestore();
  });

  it("should handle JSON parsing errors", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    global.runtimestamp = mockTimestamp;

    await fetchOverallLossData();

    expect(consoleError).toHaveBeenCalledWith(
      "Error fetching chart data:",
      expect.any(Error)
    );

    consoleError.mockRestore();
  });
});
