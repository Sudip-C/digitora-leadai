import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(() => ({ type: "supabase-client" })),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

import { createSupabaseServerClient } from "../src/lib/supabase.js";

const environment = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-key",
};

describe("server Supabase client", () => {
  beforeEach(() => {
    createClientMock.mockClear();
  });

  it("disables browser session behavior", () => {
    const client = createSupabaseServerClient({ environment });

    expect(client).toEqual({ type: "supabase-client" });
    expect(createClientMock).toHaveBeenCalledWith(
      environment.SUPABASE_URL,
      environment.SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false,
        },
      },
    );
  });

  it("adds a user access token for RLS-aware requests", () => {
    createSupabaseServerClient({
      environment,
      accessToken: " test-user-token ",
    });

    expect(createClientMock).toHaveBeenCalledWith(
      environment.SUPABASE_URL,
      environment.SUPABASE_PUBLISHABLE_KEY,
      expect.objectContaining({
        global: {
          headers: {
            Authorization: "Bearer test-user-token",
          },
        },
      }),
    );
  });
});
