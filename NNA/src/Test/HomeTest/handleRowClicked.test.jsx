import { handleRowClick } from "./handleRowClicked";
import { vi, describe, it, expect } from "vitest";

describe("handleRowClick", () => {
  it("should set the formatted timestamp and navigate", () => {
    const mockSetTimestamp = vi.fn();
    const mockNavigate = vi.fn();

    const session = {
      sessionInfo: {
        runtimestamp: "2025-04-10T14:30:00",
      },
    };

    handleRowClick(session, mockSetTimestamp, mockNavigate);

    expect(mockSetTimestamp).toHaveBeenCalledWith("2025-04-10 14:30:00");
    expect(mockNavigate).toHaveBeenCalledWith("/agents");
  });
});
