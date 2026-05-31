"use client";

import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";

export type Mood =
  | "calm"
  | "anxious"
  | "hopeful"
  | "tired"
  | "confused"
  | "heavy"
  | "grateful";

export type JournalEntry = Readonly<{
  id: string;
  user_id: string | null;
  created_at: string;
  createdAt?: string;
  prompt: string;
  mood: Mood;
  content: string;
  tags: string[];
}>;

export type JournalStorageMode = "account" | "local";
export type JournalStorageReason =
  | "signed-in"
  | "signed-out"
  | "env-missing"
  | "supabase-error";

type SaveJournalEntryInput = {
  prompt: string;
  mood: Mood;
  content: string;
  tags: string[];
};

type JournalLoadResult = {
  mode: JournalStorageMode;
  reason: JournalStorageReason;
  entries: JournalEntry[];
  error?: string;
};

type JournalSaveResult = {
  mode: JournalStorageMode;
  reason: JournalStorageReason;
  entry?: JournalEntry;
  error?: string;
};

export const journalStorageKey = "introspect:journal-entries";

function createEntryId() {
  return window.crypto?.randomUUID?.() ?? `journal-${Date.now()}`;
}

function dispatchStorageChange() {
  window.dispatchEvent(new Event("introspect-storage"));
}

function isMood(value: unknown): value is Mood {
  return (
    value === "calm" ||
    value === "anxious" ||
    value === "hopeful" ||
    value === "tired" ||
    value === "confused" ||
    value === "heavy" ||
    value === "grateful"
  );
}

function normalizeEntry(value: unknown): JournalEntry | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const entry = value as Partial<JournalEntry>;
  const createdAt = entry.created_at ?? entry.createdAt;

  if (
    typeof entry.id !== "string" ||
    typeof createdAt !== "string" ||
    typeof entry.prompt !== "string" ||
    typeof entry.content !== "string" ||
    !isMood(entry.mood)
  ) {
    return null;
  }

  return {
    id: entry.id,
    user_id: typeof entry.user_id === "string" ? entry.user_id : null,
    created_at: createdAt,
    createdAt,
    prompt: entry.prompt,
    mood: entry.mood,
    content: entry.content,
    tags: Array.isArray(entry.tags)
      ? entry.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
  };
}

function isJournalEntry(entry: JournalEntry | null): entry is JournalEntry {
  return entry !== null;
}

function sortEntries(entries: JournalEntry[]) {
  return [...entries].sort(
    (firstEntry, secondEntry) =>
      Date.parse(secondEntry.created_at) - Date.parse(firstEntry.created_at),
  );
}

export function loadLocalJournalEntries(): JournalEntry[] {
  const storedValue = window.localStorage.getItem(journalStorageKey);

  if (!storedValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(storedValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortEntries(parsed.map(normalizeEntry).filter(isJournalEntry));
  } catch {
    return [];
  }
}

function saveLocalJournalEntry(input: SaveJournalEntryInput): JournalEntry {
  const createdAt = new Date().toISOString();
  const entry: JournalEntry = {
    id: createEntryId(),
    user_id: null,
    created_at: createdAt,
    createdAt,
    prompt: input.prompt,
    mood: input.mood,
    content: input.content,
    tags: input.tags,
  };
  const nextEntries = [entry, ...loadLocalJournalEntries()];

  window.localStorage.setItem(journalStorageKey, JSON.stringify(nextEntries));
  dispatchStorageChange();

  return entry;
}

function isMissingSupabaseEnvError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("Supabase env vars are missing")
  );
}

function logSupabaseError(message: string, error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error(message, error);
  }
}

function logJournalSupabaseCheck(hasSession: boolean) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { hasSupabaseUrl, hasSupabaseAnonKey } = getSupabaseEnvStatus();

  console.info("Journal Supabase check", {
    hasSupabaseUrl,
    hasSupabaseAnonKey,
    hasSession,
  });
}

async function getSignedInUser() {
  let supabase: ReturnType<typeof createClient>;

  try {
    supabase = createClient();
  } catch (error) {
    logJournalSupabaseCheck(false);
    throw error;
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  logJournalSupabaseCheck(Boolean(session));

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    return { supabase, user: null };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    return { supabase, user: null };
  }

  return { supabase, user };
}

export async function loadJournalEntries(): Promise<JournalLoadResult> {
  try {
    const { supabase, user } = await getSignedInUser();

    if (!user) {
      return {
        mode: "local",
        reason: "signed-out",
        entries: loadLocalJournalEntries(),
      };
    }

    const { data, error } = await supabase
      .from("journal_entries")
      .select("id,user_id,created_at,prompt,mood,content,tags")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      logSupabaseError("Supabase journal load failed.", error);

      return {
        mode: "account",
        reason: "supabase-error",
        entries: [],
        error: error.message,
      };
    }

    return {
      mode: "account",
      reason: "signed-in",
      entries: sortEntries(
        (data ?? []).map(normalizeEntry).filter(isJournalEntry),
      ),
    };
  } catch (error) {
    if (!isMissingSupabaseEnvError(error)) {
      logSupabaseError("Supabase journal load failed.", error);
    }

    return {
      mode: "local",
      reason: isMissingSupabaseEnvError(error)
        ? "env-missing"
        : "supabase-error",
      entries: loadLocalJournalEntries(),
      error: error instanceof Error ? error.message : "Unable to load entries.",
    };
  }
}

export async function saveJournalEntry(
  input: SaveJournalEntryInput,
): Promise<JournalSaveResult> {
  try {
    const { supabase, user } = await getSignedInUser();

    if (!user) {
      return {
        mode: "local",
        reason: "signed-out",
        entry: saveLocalJournalEntry(input),
      };
    }

    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user.id,
        prompt: input.prompt,
        mood: input.mood,
        content: input.content,
        tags: input.tags,
      })
      .select("id,user_id,created_at,prompt,mood,content,tags")
      .single();

    if (error) {
      logSupabaseError("Supabase journal save failed.", error);

      return {
        mode: "account",
        reason: "supabase-error",
        error: error.message,
      };
    }

    return {
      mode: "account",
      reason: "signed-in",
      entry: normalizeEntry(data) ?? undefined,
    };
  } catch (error) {
    if (!isMissingSupabaseEnvError(error)) {
      logSupabaseError("Supabase journal save failed.", error);
    }

    if (!isMissingSupabaseEnvError(error)) {
      return {
        mode: "account",
        reason: "supabase-error",
        error: error instanceof Error ? error.message : "Unable to save entry.",
      };
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Supabase environment variables are missing.";

    return {
      mode: "local",
      reason: "env-missing",
      entry: saveLocalJournalEntry(input),
      error: errorMessage,
    };
  }
}
