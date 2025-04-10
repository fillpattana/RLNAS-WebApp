// tests/handleSessionCreated.test.jsx
import { handleSessionCreated } from "./handleSessionCreated";
import { vi, describe, it, expect } from "vitest";

describe("handleSessionCreated", () => {
  it("should hide the modal and show success alert", () => {
    const mockSetShowModal = vi.fn();
    const mockSetShowSuccessAlert = vi.fn();

    handleSessionCreated(mockSetShowModal, mockSetShowSuccessAlert);

    expect(mockSetShowModal).toHaveBeenCalledWith(false);
    expect(mockSetShowSuccessAlert).toHaveBeenCalledWith(true);
  });
});
// This test checks that the `handleSessionCreated` function correctly hides the modal and shows the success alert.
