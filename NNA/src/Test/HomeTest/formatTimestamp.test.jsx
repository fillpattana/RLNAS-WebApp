import { describe, it, expect } from "vitest";
import { formatTimestamp } from "./formatTimestamp";

describe("formatTimestamp", () => {
  it("should return '-' if the input is null", () => {
    expect(formatTimestamp(null)).toBe("-");
  });

  it("should return '-' if the input is undefined", () => {
    expect(formatTimestamp(undefined)).toBe("-");
  });

  it("should format ISO timestamp correctly", () => {
    const input = "2024-11-20T07:15:45.000Z"; // UTC
    const formatted = formatTimestamp(input);
    // You could get the expected format dynamically:
    const expected = new Date(input).toLocaleString("en-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    expect(formatted).toBe(expected);
  });

  it("should handle different date strings", () => {
    const input = "2024-11-20T07:15:45.000Z";
    const result = formatTimestamp(input);
    expect(result).toContain("2024");
    expect(result).toContain("2:15"); // depending on timezone, adjust if needed
  });
});
