// tests/handleStopSession.test.jsx
import { handleStopSession } from "./handleStopSession";
import { describe, it, expect, vi, afterEach } from "vitest";

global.fetch = vi.fn();

describe("handleStopSession", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("stops an active session and calls fetchData and setShowStopAlert", async () => {
    const sessions = [
      {
        sessionInfo: {
          sessionid: 42,
          endtimestamp: null,
        },
      },
    ];

    const mockSetShowStopAlert = vi.fn();
    const mockFetchData = vi.fn();

    fetch.mockResolvedValueOnce({ ok: true });

    await handleStopSession(sessions, mockSetShowStopAlert, mockFetchData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/stopsession",
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(mockFetchData).toHaveBeenCalled();
    expect(mockSetShowStopAlert).toHaveBeenCalledWith(true);
  });

  it("warns when no active session is found", async () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    const sessions = [
      {
        sessionInfo: {
          sessionid: 42,
          endtimestamp: "2024-01-01T00:00:00Z",
        },
      },
    ];

    const mockSetShowStopAlert = vi.fn();
    const mockFetchData = vi.fn();

    await handleStopSession(sessions, mockSetShowStopAlert, mockFetchData);

    expect(consoleWarnSpy).toHaveBeenCalledWith("No active session to stop.");
    expect(fetch).not.toHaveBeenCalled();
    expect(mockFetchData).not.toHaveBeenCalled();
    expect(mockSetShowStopAlert).not.toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it("handles fetch failure gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const sessions = [
      {
        sessionInfo: {
          sessionid: 123,
          endtimestamp: null,
        },
      },
    ];

    const mockSetShowStopAlert = vi.fn();
    const mockFetchData = vi.fn();

    fetch.mockResolvedValueOnce({ ok: false });

    await handleStopSession(sessions, mockSetShowStopAlert, mockFetchData);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error stopping session:",
      expect.any(Error)
    );

    expect(mockFetchData).not.toHaveBeenCalled();
    expect(mockSetShowStopAlert).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
// This test checks that the `handleStopSession` function correctly handles the case when no active session is found.
// It verifies that the function does not call the fetch API or show the stop alert in this case.
