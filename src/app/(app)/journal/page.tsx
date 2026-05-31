"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ToastContainer, useToast } from "sketchbook-ui";

import type { AssessmentDimension } from "@/data/reflectionPatternAssessment";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { buttonStyles, chipStyles, surfaceStyles } from "@/lib/design";
import {
  type JournalEntry,
  type JournalStorageReason,
  type JournalStorageMode,
  type Mood,
  loadJournalEntries,
  saveJournalEntry,
} from "@/lib/journal";

type AssessmentResult = Readonly<{
  topDimension?: AssessmentDimension;
}>;

const assessmentStorageKey = "introspect:assessment:reflection-pattern";

const moodOptions: Mood[] = [
  "calm",
  "anxious",
  "hopeful",
  "tired",
  "confused",
  "heavy",
  "grateful",
];

const generalPrompts = [
  "What emotion has been showing up for you lately?",
  "What pattern have you noticed repeating recently?",
  "What are you avoiding because it feels uncomfortable?",
  "What do you need more of right now?",
  "Where are you being harder on yourself than necessary?",
];

const promptsByDimension: Record<AssessmentDimension, string> = {
  selfWorth: "Where are you being harder on yourself than necessary?",
  emotionalAwareness: "What emotion has been showing up for you lately?",
  relationshipPatterns: "What pattern have you noticed repeating recently?",
  direction: "What do you need more of right now?",
};

function getPromptFromAssessment(value: string | null): string {
  try {
    if (!value) {
      return generalPrompts[0];
    }

    const assessment = JSON.parse(value) as AssessmentResult;

    if (assessment.topDimension && promptsByDimension[assessment.topDimension]) {
      return promptsByDimension[assessment.topDimension];
    }
  } catch {
    return generalPrompts[0];
  }

  return generalPrompts[0];
}

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("introspect-storage", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("introspect-storage", onStoreChange);
  };
}

function getAssessmentSnapshot() {
  return window.localStorage.getItem(assessmentStorageKey);
}

function formatEntryDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function JournalPage() {
  const storedAssessment = useSyncExternalStore(
    subscribeToStorage,
    getAssessmentSnapshot,
    () => null,
  );
  const [mood, setMood] = useState<Mood>("calm");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [hasTouchedContent, setHasTouchedContent] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [storageMode, setStorageMode] = useState<JournalStorageMode>("local");
  const [storageReason, setStorageReason] =
    useState<JournalStorageReason>("signed-out");
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [entryError, setEntryError] = useState("");
  const { toasts, showToast, dismissToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    async function refreshEntries() {
      setIsLoadingEntries(true);
      const result = await loadJournalEntries();

      if (!isMounted) {
        return;
      }

      setStorageMode(result.mode);
      setStorageReason(result.reason);
      setEntries(result.entries);
      setEntryError(result.error ?? "");
      setIsLoadingEntries(false);
    }

    refreshEntries();
    window.addEventListener("storage", refreshEntries);
    window.addEventListener("introspect-storage", refreshEntries);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", refreshEntries);
      window.removeEventListener("introspect-storage", refreshEntries);
    };
  }, []);

  const tags = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagsInput],
  );
  const prompt = useMemo(
    () => getPromptFromAssessment(storedAssessment),
    [storedAssessment],
  );
  const canSave = content.trim().length > 0;
  const recentEntries = entries.slice(0, 3);
  const saveModeLabel =
    storageMode === "account" ? "Supabase account" : "local device";
  const storageNote = (() => {
    if (storageReason === "signed-in") {
      return "Saving to your account.";
    }

    if (storageReason === "env-missing") {
      return "Supabase env vars are missing. Check .env.local in the project root and restart npm run dev.";
    }

    if (storageReason === "supabase-error") {
      return "Supabase is currently unavailable. Recent local entries may still appear below.";
    }

    return "Saving locally because you are signed out.";
  })();
  const storageNoteClassName =
    storageReason === "env-missing" || storageReason === "supabase-error"
      ? "rounded-xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-sm text-amber-900"
      : "rounded-xl border border-stone-200 bg-white/55 px-4 py-3 text-sm text-stone-500";

  async function saveEntry() {
    setHasTouchedContent(true);

    if (!canSave) {
      setSaveMessage("");
      return;
    }

    setIsSaving(true);
    setEntryError("");

    const result = await saveJournalEntry({
      prompt,
      mood,
      content: content.trim(),
      tags,
    });

    setStorageMode(result.mode);
    setStorageReason(result.reason);

    if (result.error) {
      setEntryError(result.error);
    }

    if (!result.entry) {
      setSaveMessage("This entry could not be saved. Please try again.");
      setIsSaving(false);
      return;
    }

    setEntries((currentEntries) =>
      [result.entry as JournalEntry, ...currentEntries]
        .filter(
          (entry, index, allEntries) =>
            allEntries.findIndex((item) => item.id === entry.id) === index,
        )
        .sort(
          (firstEntry, secondEntry) =>
            Date.parse(secondEntry.created_at) - Date.parse(firstEntry.created_at),
        )
        .slice(0, 3),
    );
    setMood("calm");
    setContent("");
    setTagsInput("");
    setHasTouchedContent(false);
    setSaveMessage(
      result.mode === "account"
        ? "Saved to your account."
        : "Saved locally. You can return to this reflection later.",
    );
    showToast("Journal entry saved.", "success", 2400);
    setIsSaving(false);
  }

  return (
    <section className="space-y-6">
      <SoftCard className="space-y-8">
        <PageHeader
          eyebrow="Journal"
          title="A place to write without hurry."
          description="Use this space to notice what is present today."
        />

        <div className={storageNoteClassName}>
          <p className="text-sm font-semibold text-stone-700">
            Saving to: {saveModeLabel}
          </p>
          <p className="mt-1">{storageNote}</p>
        </div>

        <div className={`${surfaceStyles.subtle} p-5 sm:p-6`}>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-400">
            Suggested prompt
          </p>
          <p className="mt-3 text-lg font-semibold leading-7 text-[#332f2a] sm:text-xl">
            {prompt}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-stone-800" id="mood-label">
              Mood
            </p>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="group"
              aria-labelledby="mood-label"
            >
              {moodOptions.map((moodOption) => {
                const isSelected = mood === moodOption;

                return (
                  <button
                    key={moodOption}
                    type="button"
                    onClick={() => setMood(moodOption)}
                    aria-pressed={isSelected}
                    className={`${chipStyles.base} capitalize ${
                      isSelected
                        ? chipStyles.selected
                        : chipStyles.unselected
                    }`}
                  >
                    {moodOption}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="journal-content"
              className="text-sm font-semibold text-stone-800"
            >
              Reflection
            </label>
            <textarea
              id="journal-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              onBlur={() => setHasTouchedContent(true)}
              placeholder="Write what feels useful to notice..."
              className="introspect-field introspect-textarea mt-2 px-4 py-3 text-sm leading-7"
            />
            {hasTouchedContent && !canSave ? (
              <p className="mt-2 text-sm text-stone-500">
                Add a few words before saving this reflection.
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="journal-tags"
              className="text-sm font-semibold text-stone-800"
            >
              Tags, optional
            </label>
            <input
              id="journal-tags"
              type="text"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="patterns, work, rest"
              className="introspect-field mt-2 px-4 py-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-h-6 text-sm text-[#65755d]" aria-live="polite">
              {saveMessage}
            </p>
            <button
              type="button"
              onClick={saveEntry}
              disabled={!canSave || isSaving}
              className={buttonStyles.primary}
            >
              {isSaving ? "Saving..." : "Save entry"}
            </button>
          </div>
          {entryError ? (
            <p
              className="rounded-xl border border-rose-200/80 bg-rose-50/60 px-4 py-3 text-sm leading-6 text-rose-800"
              role="alert"
            >
              {entryError}
            </p>
          ) : null}
        </div>
      </SoftCard>

      <SoftCard>
        <h3 className="text-base font-semibold text-stone-950">
          Recent entries
        </h3>
        {isLoadingEntries ? (
          <p className="mt-4 text-sm leading-6 text-stone-500">
            Loading recent reflections...
          </p>
        ) : recentEntries.length > 0 ? (
          <div className="mt-5 space-y-4">
            {recentEntries.map((entry) => (
              <article
                key={entry.id}
                className={`${surfaceStyles.panel} p-5`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase text-stone-400">
                  <time dateTime={entry.created_at}>
                    {formatEntryDate(entry.created_at)}
                  </time>
                  <span>{entry.mood}</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-stone-900">
                  {entry.prompt}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {entry.content.length > 150
                    ? `${entry.content.slice(0, 150)}...`
                    : entry.content}
                </p>
                {entry.tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-stone-200 bg-[#f7f4ee] px-3 py-1 text-xs text-stone-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-stone-500">
            Your latest reflections will appear here after you save an entry.
          </p>
        )}
      </SoftCard>

      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        position="bottom-right"
        size="sm"
        typography={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.9rem" }}
        colors={{
          success: {
            bg: "#f6fbf3",
            border: "#9caf88",
            tape: "#e7d7b8",
          },
        }}
      />
    </section>
  );
}
