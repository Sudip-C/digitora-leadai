const PUBLISHABLE_KEY_PREFIX = "sb_publishable_";

function readRequiredString(source, name) {
  const value = source[name];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function readHttpUrl(source, name) {
  const value = readRequiredString(source, name);

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Unsupported URL protocol");
    }

    return url.origin;
  } catch {
    throw new Error(`${name} must be a valid HTTP(S) URL.`);
  }
}

export function parseWebEnvironment(source = {}) {
  const supabaseUrl = readHttpUrl(source, "VITE_SUPABASE_URL");
  const supabasePublishableKey = readRequiredString(source, "VITE_SUPABASE_PUBLISHABLE_KEY");

  if (!supabasePublishableKey.startsWith(PUBLISHABLE_KEY_PREFIX)) {
    throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY must be a Supabase publishable key.");
  }

  return Object.freeze({
    supabaseUrl,
    supabasePublishableKey,
  });
}

export function loadWebEnvironment() {
  return parseWebEnvironment({
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  });
}
