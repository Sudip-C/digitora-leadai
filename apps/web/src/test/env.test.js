import { describe, expect, it } from "vitest";

import { parseWebEnvironment } from "../config/env.js";

const validEnvironment = {
  VITE_SUPABASE_URL: "https://example.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-key",
};

describe("web environment", () => {
  it("parses and freezes valid Supabase configuration", () => {
    const environment = parseWebEnvironment(validEnvironment);

    expect(environment).toEqual({
      supabaseUrl: "https://example.supabase.co",
      supabasePublishableKey: "sb_publishable_test-key",
    });
    expect(Object.isFrozen(environment)).toBe(true);
  });

  it("rejects a missing project URL", () => {
    expect(() =>
      parseWebEnvironment({
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-key",
      }),
    ).toThrow("Missing required environment variable: VITE_SUPABASE_URL");
  });

  it("rejects an invalid project URL", () => {
    expect(() =>
      parseWebEnvironment({
        ...validEnvironment,
        VITE_SUPABASE_URL: "not-a-url",
      }),
    ).toThrow("VITE_SUPABASE_URL must be a valid HTTP(S) URL.");
  });

  it("rejects secret or legacy keys in browser configuration", () => {
    expect(() =>
      parseWebEnvironment({
        ...validEnvironment,
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_secret_do-not-expose",
      }),
    ).toThrow("must be a Supabase publishable key");
  });
});
