"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Button, Input, Textarea, ToastContainer, useToast } from "sketchbook-ui";

import type { AssessmentDimension } from "@/data/reflectionPatternAssessment";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

type Mood =
  | "calm"
  | "anxious"
  | "hopeful"
  | "tired"
  | "confused"
  | "heavy"
  | "grateful";

type JournalEntry = Readonly<{
  id: string;
  createdAt: string;
  prompt: string;
  mood: Mood;
  content: string;
  tags: string[];
}>;

type AssessmentResult = Readonly<{
  topDimension?: AssessmentDimension;
}>;

const journalStorageKey = "introspect:journal-entries";
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

const sketchButtonColors = {
  bg: "#e4ecdf",
  bgOverlay: "#d5e2cf",
  stroke: "#6f8068",
  text: "#263225",
};

const sketchTypography = {
  fontFamily: "var(--font-geist-sans)",
  fontSize: "0.95rem",
  fontWeight: 700,
};

const sketchFieldColors = {
  bg: "#fffefa",
  bgOverlay: "#f4f3ec",
  stroke: "#b8aa96",
  text: "#3f3a34",
  label: "#3f3a34",
  lineColor: "#d7cdbc",
  marginColor: "#d9a7a0",
};

function parseStoredEntries(value: string | null): JournalEntry[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

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

function getJournalSnapshot() {
  return window.localStorage.getItem(journalStorageKey) ?? "[]";
}

function getAssessmentSnapshot() {
  return window.localStorage.getItem(assessmentStorageKey);
}

function dispatchStorageChange() {
  window.dispatchEvent(new Event("introspect-storage"));
}

function createEntryId() {
  return window.crypto?.randomUUID?.() ?? `journal-${Date.now()}`;
}

function formatEntryDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function JournalPage() {
  const storedEntries = useSyncExternalStore(
    subscribeToStorage,
    getJournalSnapshot,
    () => "[]",
  );
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
  const { toasts, showToast, dismissToast } = useToast();

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
  const entries = useMemo(
    () =>
      parseStoredEntries(storedEntries).sort(
        (firstEntry, secondEntry) =>
          Date.parse(secondEntry.createdAt) - Date.parse(firstEntry.createdAt),
      ),
    [storedEntries],
  );
  const canSave = content.trim().length > 0;
  const recentEntries = entries.slice(0, 3);

  function saveEntry() {
    setHasTouchedContent(true);

    if (!canSave) {
      setSaveMessage("");
      return;
    }

    const nextEntry: JournalEntry = {
      id: createEntryId(),
      createdAt: new Date().toISOString(),
      prompt,
      mood,
      content: content.trim(),
      tags,
    };
    const nextEntries = [nextEntry, ...entries];

    window.localStorage.setItem(journalStorageKey, JSON.stringify(nextEntries));
    dispatchStorageChange();
    setMood("calm");
    setContent("");
    setTagsInput("");
    setHasTouchedContent(false);
    setSaveMessage("Saved. You can return to this reflection later.");
    showToast("Journal entry saved.", "success", 2400);
  }

  return (
    <section className="space-y-6">
      <SoftCard className="space-y-8">
        <PageHeader
          eyebrow="Journal"
          title="A place to write without hurry."
          description="Use this space to notice what is present today. Your entries stay on this device for now."
        />

        <div className="rounded-lg bg-white/60 p-6 ring-1 ring-[#dfe6dc]">
          <p className="text-sm font-medium uppercase text-stone-400">
            Suggested prompt
          </p>
          <p className="mt-3 text-xl font-semibold leading-8 text-stone-950">
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
                    className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 ${
                      isSelected
                        ? "bg-[#e4ecdf] text-stone-900 ring-[#8fa184]"
                        : "bg-white/70 text-stone-600 ring-[#d7cdbc] hover:bg-white"
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
            <Textarea
              id="journal-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              onBlur={() => setHasTouchedContent(true)}
              size="sm"
              showLines
              showMargin={false}
              colors={sketchFieldColors}
              typography={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: "0.95rem",
                fontWeight: 400,
              }}
              placeholder="Write what feels useful to notice..."
              className="introspect-sketch-field mt-2"
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
            <Input
              id="journal-tags"
              type="text"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              size="sm"
              colors={sketchFieldColors}
              typography={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: "0.95rem",
                fontWeight: 400,
              }}
              placeholder="patterns, work, rest"
              className="introspect-sketch-field mt-2"
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-[#d7cdbc] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-h-6 text-sm text-stone-500" aria-live="polite">
              {saveMessage}
            </p>
            <Button
              type="button"
              onClick={saveEntry}
              disabled={!canSave}
              size="sm"
              colors={sketchButtonColors}
              typography={sketchTypography}
            >
              Save entry
            </Button>
          </div>
        </div>
      </SoftCard>

      <SoftCard>
        <h3 className="text-base font-semibold text-stone-950">
          Recent entries
        </h3>
        {recentEntries.length > 0 ? (
          <div className="mt-5 space-y-4">
            {recentEntries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-lg bg-white/65 p-5 ring-1 ring-[#dfe6dc]"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase text-stone-400">
                  <time dateTime={entry.createdAt}>
                    {formatEntryDate(entry.createdAt)}
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
                        className="rounded-full bg-[#f6f7f4] px-3 py-1 text-xs text-stone-500 ring-1 ring-[#dfe6dc]"
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
