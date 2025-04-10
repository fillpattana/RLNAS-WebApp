import { handleChange } from "./handleChange";
import { describe, beforeEach, it, vi, expect } from "vitest";

describe("handleChange", () => {
  let formData;
  let setFormData;

  beforeEach(() => {
    formData = {
      agentmode: false,
      maxagents: 1,
      datasetname: "",
    };

    setFormData = vi.fn();
  });

  it("updates checkbox field correctly", () => {
    const event = {
      target: {
        name: "agentmode",
        type: "checkbox",
        checked: true,
      },
    };

    handleChange(event, formData, setFormData);

    expect(setFormData).toHaveBeenCalledWith({
      ...formData,
      agentmode: true,
    });
  });

  it("updates range field with number", () => {
    const event = {
      target: {
        name: "maxagents",
        type: "range",
        value: "5",
      },
    };

    handleChange(event, formData, setFormData);

    expect(setFormData).toHaveBeenCalledWith({
      ...formData,
      maxagents: 5,
    });
  });

  it("updates regular text field", () => {
    const event = {
      target: {
        name: "datasetname",
        type: "text",
        value: "MNIST",
      },
    };

    handleChange(event, formData, setFormData);

    expect(setFormData).toHaveBeenCalledWith({
      ...formData,
      datasetname: "MNIST",
    });
  });
});
