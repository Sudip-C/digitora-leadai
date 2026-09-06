import { describe, expect, it } from "vitest";

import { parseEnvironment } from "../src/config/env.js";

const validEnvironment = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-key",
};

describe("API environment", () => {
  it("parses and freezes valid Supabase configuration", () => {
    const environment = parseEnvironment(validEnvironment);

    expect(environment).toMatchObject({
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-key",
    });
    expect(Object.isFrozen(environment)).toBe(true);
  });

  it("rejects an invalid Supabase URL", () => {
    expect(() =>
      parseEnvironment({
        ...validEnvironment,
        SUPABASE_URL: "not-a-url",
      }),
    ).toThrow("SUPABASE_URL");
  });

  it("rejects a secret key as the API public client key", () => {
    expect(() =>
      parseEnvironment({
        ...validEnvironment,
        SUPABASE_PUBLISHABLE_KEY: "sb_secret_do-not-use-here",
      }),
    ).toThrow("must be a Supabase publishable key");
  });
});
