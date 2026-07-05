import { describe, expect, it } from "vitest";
import { optionalEnvValue } from "./env";

describe("optionalEnvValue", () => {
  it("trims values and returns undefined for empty input", () => {
    expect(optionalEnvValue(" value ")).toBe("value");
    expect(optionalEnvValue("   ")).toBeUndefined();
    expect(optionalEnvValue(undefined)).toBeUndefined();
  });
});
