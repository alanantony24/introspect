"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "sketchbook-ui";

import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import {
  type AssessmentDimension,
  dimensionDetails,
  likertOptions,
  reflectionPatternQuestions,
} from "@/data/reflectionPatternAssessment";

type Answers = Record<string, number>;
type DimensionScores = Record<AssessmentDimension, number>;

const dimensions: AssessmentDimension[] = [
  "selfWorth",
  "emotionalAwareness",
  "relationshipPatterns",
  "direction",
];

const sketchButtonColors = {
  bg: "#fffefa",
  bgOverlay: "#f1efe7",
  stroke: "#9f927f",
  text: "#3f3a34",
};

const sketchPrimaryButtonColors = {
  bg: "#e4ecdf",
  bgOverlay: "#d5e2cf",
  stroke: "#6f8068",
  text: "#263225",
};

const sketchButtonTypography = {
  fontFamily: "var(--font-geist-sans)",
  fontSize: "0.95rem",
  fontWeight: 700,
};

function calculateScores(answers: Answers): DimensionScores {
  const totals = dimensions.reduce(
    (scores, dimension) => ({
      ...scores,
      [dimension]: { total: 0, count: 0 },
    }),
    {} as Record<AssessmentDimension, { total: number; count: number }>,
  );

  reflectionPatternQuestions.forEach((question) => {
    const answer = answers[question.id];
    const score = question.reverseScored ? 6 - answer : answer;

    totals[question.dimension].total += score;
    totals[question.dimension].count += 1;
  });

  return dimensions.reduce((scores, dimension) => {
    const { total, count } = totals[dimension];

    return {
      ...scores,
      [dimension]: Number((total / count).toFixed(2)),
    };
  }, {} as DimensionScores);
}

function getTopDimension(scores: DimensionScores): AssessmentDimension {
  return dimensions.reduce((topDimension, dimension) =>
    scores[dimension] > scores[topDimension] ? dimension : topDimension,
  );
}

export default function AssessmentPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<{
    scores: DimensionScores;
    topDimension: AssessmentDimension;
  } | null>(null);

  const question = reflectionPatternQuestions[currentQuestionIndex];
  const selectedAnswer = answers[question.id];
  const isFinalQuestion =
    currentQuestionIndex === reflectionPatternQuestions.length - 1;

  function selectAnswer(value: number) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.id]: value,
    }));
  }

  function goBack() {
    setCurrentQuestionIndex((index) => Math.max(index - 1, 0));
  }

  function goNext() {
    if (!selectedAnswer) {
      return;
    }

    if (!isFinalQuestion) {
      setCurrentQuestionIndex((index) => index + 1);
      return;
    }

    const scores = calculateScores(answers);
    const topDimension = getTopDimension(scores);
    const savedResult = {
      completedAt: new Date().toISOString(),
      assessmentName: "Reflection Pattern Assessment",
      answers,
      scores,
      topDimension,
    };

    window.localStorage.setItem(
      "introspect:assessment:reflection-pattern",
      JSON.stringify(savedResult),
    );

    setResult({ scores, topDimension });
  }

  if (result) {
    const topReflection = dimensionDetails[result.topDimension];

    return (
      <section className="space-y-6">
        <SoftCard>
          <PageHeader
            eyebrow="Reflection Pattern Assessment"
            title={`${topReflection.label} may be asking for attention.`}
            description={topReflection.explanation}
          />
          <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-500">
            This is not a diagnosis or a fixed label. It is a simple reflection
            snapshot based on your answers today.
          </p>
        </SoftCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <SoftCard className="p-6 sm:p-6">
            <h3 className="text-base font-semibold text-stone-950">
              Strengths to notice
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
              {topReflection.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </SoftCard>

          <SoftCard className="p-6 sm:p-6">
            <h3 className="text-base font-semibold text-stone-950">
              Blind spots to reflect on
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
              {topReflection.blindSpots.map((blindSpot) => (
                <li key={blindSpot}>{blindSpot}</li>
              ))}
            </ul>
          </SoftCard>
        </div>

        <SoftCard>
          <h3 className="text-base font-semibold text-stone-950">
            Suggested journal prompts
          </h3>
          <div className="mt-5 grid gap-3">
            {topReflection.prompts.map((prompt) => (
              <div
                key={prompt}
                className="rounded-lg bg-white/65 p-4 text-sm leading-6 text-stone-600 ring-1 ring-[#dfe6dc]"
              >
                {prompt}
              </div>
            ))}
          </div>

          <Link
            href="/journal"
            className="mt-8 inline-flex rounded-lg bg-[#e4ecdf] px-5 py-3 text-sm font-semibold text-stone-800 ring-1 ring-[#b8c8b0] transition hover:bg-[#d8e5d1] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
          >
            Go to journal
          </Link>
        </SoftCard>
      </section>
    );
  }

  return (
    <SoftCard className="space-y-8">
      <PageHeader
        eyebrow={`Question ${currentQuestionIndex + 1} of ${
          reflectionPatternQuestions.length
        }`}
        title="Reflection Pattern Assessment"
        description="This gentle check-in can help identify which area may be most useful to reflect on right now."
      />

      <div className="rounded-lg bg-white/65 p-6 ring-1 ring-[#d7cdbc] sm:p-7">
        <p className="text-xl font-semibold leading-8 text-stone-950">
          {question.text}
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {likertOptions.map((option) => {
          const isSelected = selectedAnswer === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => selectAnswer(option.value)}
              aria-pressed={isSelected}
              className={`flex min-h-16 items-center justify-between gap-4 rounded-lg p-4 text-left shadow-sm ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 ${
                isSelected
                  ? "bg-[#e4ecdf] text-stone-950 ring-[#8fa184]"
                  : "bg-white/70 text-stone-700 ring-[#d7cdbc] hover:bg-white hover:text-stone-950"
              }`}
            >
              <span className="text-sm font-semibold">{option.label}</span>
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm ${
                  isSelected
                    ? "bg-white text-stone-900 ring-1 ring-[#8fa184]"
                    : "bg-[#f6f7f4] text-stone-500"
                }`}
              >
                {option.value}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#d7cdbc] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          onClick={goBack}
          disabled={currentQuestionIndex === 0}
          size="sm"
          colors={sketchButtonColors}
          typography={sketchButtonTypography}
        >
          Back
        </Button>

        <Button
          type="button"
          onClick={goNext}
          disabled={!selectedAnswer}
          size="sm"
          colors={sketchPrimaryButtonColors}
          typography={sketchButtonTypography}
        >
          {isFinalQuestion ? "See reflection" : "Next"}
        </Button>
      </div>
    </SoftCard>
  );
}
