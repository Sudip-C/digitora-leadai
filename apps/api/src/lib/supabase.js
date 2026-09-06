import { createClient } from "@supabase/supabase-js";

import { env } from "../config/env.js";

export function createSupabaseServerClient({ environment = env, accessToken } = {}) {
  const clientOptions = {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  };

  const normalizedAccessToken = typeof accessToken === "string" ? accessToken.trim() : "";

  if (normalizedAccessToken) {
    clientOptions.global = {
      headers: {
        Authorization: `Bearer ${normalizedAccessToken}`,
      },
    };
  }

  return createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_PUBLISHABLE_KEY,
    clientOptions,
  );
}

export const supabase = createSupabaseServerClient();
