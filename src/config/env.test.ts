import { describe, expect, it } from "vitest";
import { envBoolean, optionalEnvValue } from "./env";

describe("optionalEnvValue", () => {
  it("trims values and returns undefined for empty input", () => {
    expect(optionalEnvValue(" value ")).toBe("value");
    expect(optionalEnvValue("   ")).toBeUndefined();
    expect(optionalEnvValue(undefined)).toBeUndefined();
  });
});

describe("envBoolean", () => {
  it("accepts explicit booleans and uses the fallback for empty values", () => {
    expect(envBoolean("true", "FEATURE", false)).toBe(true);
    expect(envBoolean(" false ", "FEATURE", true)).toBe(false);
    expect(envBoolean(undefined, "FEATURE", true)).toBe(true);
  });

  it("rejects ambiguous values", () => {
    expect(() => envBoolean("sometimes", "FEATURE", true)).toThrow(
      'FEATURE must be "true" or "false".',
    );
  });
});
