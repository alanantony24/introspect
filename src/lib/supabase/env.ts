type SupabaseEnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY";

type SupabaseEnvStatus = {
  hasSupabaseUrl: boolean;
  hasSupabaseAnonKey: boolean;
  missing: SupabaseEnvKey[];
};

type SupabaseEnv = {
  url: string;
  anonKey: string;
};

let hasLoggedSupabaseEnvPresence = false;

function logSupabaseEnvPresence(hasSupabaseUrl: boolean, hasSupabaseAnonKey: boolean) {
  if (process.env.NODE_ENV !== "development" || hasLoggedSupabaseEnvPresence) {
    return;
  }

  hasLoggedSupabaseEnvPresence = true;
  console.info("Supabase env check", {
    hasSupabaseUrl,
    hasSupabaseAnonKey,
  });
}

export function getSupabaseEnvStatus(): SupabaseEnvStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasSupabaseUrl = Boolean(url);
  const hasSupabaseAnonKey = Boolean(anonKey);
  const missing: SupabaseEnvStatus["missing"] = [];

  if (!hasSupabaseUrl) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!hasSupabaseAnonKey) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return {
    hasSupabaseUrl,
    hasSupabaseAnonKey,
    missing,
  };
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { hasSupabaseUrl, hasSupabaseAnonKey, missing } =
    getSupabaseEnvStatus();

  logSupabaseEnvPresence(hasSupabaseUrl, hasSupabaseAnonKey);

  if (missing.length > 0) {
    throw new Error(
      `Supabase env vars are missing: ${missing.join(
        ", ",
      )}. Check .env.local in the project root and restart npm run dev.`,
    );
  }

  return {
    url: url as string,
    anonKey: anonKey as string,
  };
}
