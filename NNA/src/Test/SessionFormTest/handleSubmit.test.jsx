import { vi, describe, it, expect, beforeEach } from "vitest";
import { handleSubmit } from "./handleSubmit";

describe("handleSubmit", () => {
  const mockEvent = { preventDefault: vi.fn() };
  const mockFormData = { name: "Test Session" };
  const mockOnSuccess = vi.fn();
  const mockSetError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call onSuccess when the form submission is successful", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Success" }),
      })
    );

    await handleSubmit(mockEvent, mockFormData, mockOnSuccess, mockSetError);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/newsession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockFormData),
    });
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("should call setError when the form submission fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await handleSubmit(mockEvent, mockFormData, mockOnSuccess, mockSetError);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/newsession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockFormData),
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalledWith("Failed to submit form data");
  });

  it("should handle fetch throwing an error", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network Error")));

    await handleSubmit(mockEvent, mockFormData, mockOnSuccess, mockSetError);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/newsession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockFormData),
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalledWith("Network Error");
  });
});
