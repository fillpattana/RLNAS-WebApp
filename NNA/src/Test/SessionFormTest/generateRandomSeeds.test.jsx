import { generateRandomSeeds } from "./generateRandomSeeds";
import { describe, it, expect } from "vitest";

describe("generateRandomSeeds", () => {
  it("should return valid random seeds for session, env, and agent", () => {
    const seeds = generateRandomSeeds();

    expect(typeof seeds.seed).toBe("number");
    expect(typeof seeds.envseed).toBe("number");
    expect(typeof seeds.agentseed).toBe("number");

    expect(seeds.seed).toBeGreaterThanOrEqual(0);
    expect(seeds.seed).toBeLessThan(100000);
    expect(seeds.envseed).toBeLessThan(100000);
    expect(seeds.agentseed).toBeLessThan(100000);
  });

  it("should return different values on multiple calls", () => {
    const seeds1 = generateRandomSeeds();
    const seeds2 = generateRandomSeeds();

    const allSame =
      seeds1.seed === seeds2.seed &&
      seeds1.envseed === seeds2.envseed &&
      seeds1.agentseed === seeds2.agentseed;

    expect(allSame).toBe(false); // very unlikely to be same
  });
});
