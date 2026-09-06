import { createClient } from "@supabase/supabase-js";

import { loadWebEnvironment, parseWebEnvironment } from "../config/env.js";

const AUTH_OPTIONS = Object.freeze({
  autoRefreshToken: true,
  detectSessionInUrl: true,
  persistSession: true,
});

function createClientFromConfig({ supabaseUrl, supabasePublishableKey }) {
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: AUTH_OPTIONS,
  });
}

export function createBrowserSupabaseClient(environment) {
  return createClientFromConfig(parseWebEnvironment(environment));
}

let browserClient;

export function getSupabaseClient() {
  if (!browserClient) {
    browserClient = createClientFromConfig(loadWebEnvironment());
  }

  return browserClient;
}
