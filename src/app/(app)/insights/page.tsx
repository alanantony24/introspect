"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import {
  type AssessmentDimension,
  dimensionDetails,
} from "@/data/reflectionPatternAssessment";

type OnboardingAnswer = Readonly<{
  question: string;
  answer?: string;
}>;

type OnboardingData = Readonly<{
  completedAt?: string;
  answers?: OnboardingAnswer[];
}>;

type AssessmentResult = Readonly<{
  completedAt?: string;
  topDimension?: AssessmentDimension;
  scores?: Partial<Record<AssessmentDimension, number>>;
}>;

type JournalEntry = Readonly<{
  id: string;
  createdAt: string;
  prompt: string;
  mood: string;
  content: string;
  tags: string[];
}>;

type SavedData = Readonly<{
  onboarding: OnboardingData | null;
  assessment: AssessmentResult | null;
  journalEntries: JournalEntry[];
}>;

const onboardingStorageKey = "introspect:onboarding";
const assessmentStorageKey = "introspect:assessment:reflection-pattern";
const journalStorageKey = "introspect:journal-entries";

const emptySavedData: SavedData = {
  onboarding: null,
  assessment: null,
  journalEntries: [],
};

function parseObject<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function parseJournalEntries(value: string | null): JournalEntry[] {
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

function loadSavedData(): SavedData {
  return {
    onboarding: parseObject<OnboardingData>(
      window.localStorage.getItem(onboardingStorageKey),
    ),
    assessment: parseObject<AssessmentResult>(
      window.localStorage.getItem(assessmentStorageKey),
    ),
    journalEntries: parseJournalEntries(
      window.localStorage.getItem(journalStorageKey),
    ).sort(
      (firstEntry, secondEntry) =>
        Date.parse(secondEntry.createdAt) - Date.parse(firstEntry.createdAt),
    ),
  };
}

function getTopCounts(items: string[], limit: number) {
  const counts = items.reduce<Record<string, number>>((totals, item) => {
    const normalizedItem = item.trim().toLowerCase();

    if (!normalizedItem) {
      return totals;
    }

    return {
      ...totals,
      [normalizedItem]: (totals[normalizedItem] ?? 0) + 1,
    };
  }, {});

  return Object.entries(counts)
    .sort((firstItem, secondItem) => secondItem[1] - firstItem[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function InsightsPage() {
  const [savedData, setSavedData] = useState<SavedData>(emptySavedData);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    function refreshSavedData() {
      setSavedData(loadSavedData());
      setHasLoaded(true);
    }

    queueMicrotask(refreshSavedData);
    window.addEventListener("storage", refreshSavedData);
    window.addEventListener("introspect-storage", refreshSavedData);

    return () => {
      window.removeEventListener("storage", refreshSavedData);
      window.removeEventListener("introspect-storage", refreshSavedData);
    };
  }, []);

  const assessmentFocus = savedData.assessment?.topDimension
    ? dimensionDetails[savedData.assessment.topDimension]
    : null;
  const journalEntries = savedData.journalEntries;
  const recentEntries = journalEntries.slice(0, 3);
  const moodCounts = useMemo(
    () => getTopCounts(journalEntries.map((entry) => entry.mood), 3),
    [journalEntries],
  );
  const tagCounts = useMemo(
    () =>
      getTopCounts(
        journalEntries.flatMap((entry) => entry.tags ?? []),
        5,
      ),
    [journalEntries],
  );
  const mostRecentMood = journalEntries[0]?.mood ?? "Not yet";
  const mostCommonTag = tagCounts[0]?.label;

  return (
    <section className="space-y-6">
      <SoftCard>
        <PageHeader
          eyebrow="Insights"
          title="Saved reflections over time."
          description="A quiet summary of what you have saved on this device so far. These patterns are invitations to reflect, not fixed conclusions."
        />
      </SoftCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SoftCard className="p-6 sm:p-6">
          <p className="text-sm font-medium text-stone-400">
            Reflection area
          </p>
          <p className="mt-3 text-2xl font-semibold text-stone-950">
            {assessmentFocus?.label ?? "Not yet"}
          </p>
        </SoftCard>

        <SoftCard className="p-6 sm:p-6">
          <p className="text-sm font-medium text-stone-400">
            Journal entries
          </p>
          <p className="mt-3 text-2xl font-semibold text-stone-950">
            {journalEntries.length}
          </p>
        </SoftCard>

        <SoftCard className="p-6 sm:p-6">
          <p className="text-sm font-medium text-stone-400">
            Most recent mood
          </p>
          <p className="mt-3 text-2xl font-semibold capitalize text-stone-950">
            {mostRecentMood}
          </p>
        </SoftCard>

        <SoftCard className="p-6 sm:p-6">
          <p className="text-sm font-medium text-stone-400">
            Most common tag
          </p>
          <p className="mt-3 text-2xl font-semibold text-stone-950">
            {mostCommonTag ?? "Not yet"}
          </p>
        </SoftCard>
      </div>

      <SoftCard className="space-y-5">
        <h3 className="text-lg font-semibold text-stone-950">
          Current reflection focus
        </h3>
        {assessmentFocus ? (
          <div className="space-y-3">
            <p className="text-2xl font-semibold text-stone-950">
              {assessmentFocus.label}
            </p>
            <p className="max-w-2xl text-sm leading-7 text-stone-600">
              {assessmentFocus.explanation} This could be worth exploring
              alongside your recent journal entries.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="max-w-2xl text-sm leading-7 text-stone-600">
              Complete the Reflection Pattern Assessment to see which area may
              be most useful to reflect on right now.
            </p>
            <Link
              href="/assessment"
              className="inline-flex rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Go to assessment
            </Link>
          </div>
        )}
      </SoftCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SoftCard>
          <h3 className="text-lg font-semibold text-stone-950">
            Mood overview
          </h3>
          {moodCounts.length > 0 ? (
            <div className="mt-5 space-y-3">
              {moodCounts.map((mood) => (
                <div
                  key={mood.label}
                  className="flex items-center justify-between rounded-lg bg-white/70 p-4 text-sm shadow-sm ring-1 ring-[#d7cdbc]"
                >
                  <span className="font-medium capitalize text-stone-700">
                    {mood.label}
                  </span>
                  <span className="text-stone-500">{mood.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-stone-500">
              Moods will appear here after you save journal entries.
            </p>
          )}
        </SoftCard>

        <SoftCard>
          <h3 className="text-lg font-semibold text-stone-950">
            Recurring tags
          </h3>
          {tagCounts.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {tagCounts.map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-full bg-white/70 px-4 py-2 text-sm text-stone-600 shadow-sm ring-1 ring-[#d7cdbc]"
                >
                  {tag.label} ({tag.count})
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-stone-500">
              Tags are optional. If you add them to entries, recurring themes
              will appear here.
            </p>
          )}
        </SoftCard>
      </div>

      <SoftCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-stone-950">
            Recent entries
          </h3>
          {journalEntries.length === 0 ? (
            <Link
              href="/journal"
              className="inline-flex rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Write in journal
            </Link>
          ) : null}
        </div>

        {recentEntries.length > 0 ? (
          <div className="mt-5 space-y-4">
            {recentEntries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-lg bg-white/70 p-5 shadow-sm ring-1 ring-[#d7cdbc]"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase text-stone-400">
                  <time dateTime={entry.createdAt}>
                    {formatDate(entry.createdAt)}
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
                        className="rounded-full bg-[#f6f7f4] px-3 py-1 text-xs text-stone-500 ring-1 ring-[#d7cdbc]"
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
          <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-500">
            No journal entries yet. When you save a reflection, this space will
            begin to show recent moods, prompts, and themes.
          </p>
        )}
      </SoftCard>

      {!hasLoaded ? (
        <p className="text-sm text-stone-400" aria-live="polite">
          Loading saved reflections...
        </p>
      ) : null}
    </section>
  );
}
