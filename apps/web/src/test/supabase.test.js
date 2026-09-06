import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(() => ({ type: "supabase-client" })),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

import { createBrowserSupabaseClient } from "../lib/supabase.js";

describe("browser Supabase client", () => {
  beforeEach(() => {
    createClientMock.mockClear();
  });

  it("creates a client with persistent browser sessions", () => {
    const client = createBrowserSupabaseClient({
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-key",
    });

    expect(client).toEqual({ type: "supabase-client" });
    expect(createClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "sb_publishable_test-key",
      {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
        },
      },
    );
  });
});
