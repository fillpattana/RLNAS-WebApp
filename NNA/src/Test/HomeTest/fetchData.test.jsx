import { fetchData } from "./fetchData";
import { vi, describe, it, expect } from "vitest";

describe("fetchData", () => {
  it("should call setSessions with data from the API", async () => {
    const mockData = [{ sessionInfo: { sessionid: 1 } }];
    const mockSetSessions = vi.fn();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );

    await fetchData(mockSetSessions);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/ActiveSessions"
    );
    expect(mockSetSessions).toHaveBeenCalledWith(mockData);
  });

  it("should catch and log error if fetch fails", async () => {
    const mockSetSessions = vi.fn();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    await fetchData(mockSetSessions);

    expect(console.error).toHaveBeenCalledWith(
      "Error fetching sessions:",
      expect.any(Error)
    );

    errorSpy.mockRestore();
  });
});
// This test suite contains two tests for the fetchData function:
// 1. The first test checks if the function correctly fetches data from the API and calls setSessions with the received data.
// 2. The second test checks if the function handles errors correctly by logging them to the console when the fetch fails.
