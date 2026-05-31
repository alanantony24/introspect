"use client";

import Link from "next/link";
import { useState } from "react";

import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { buttonStyles, surfaceStyles } from "@/lib/design";
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
                className={`${surfaceStyles.panel} p-4 text-sm leading-6 text-stone-600`}
              >
                {prompt}
              </div>
            ))}
          </div>

          <Link
            href="/journal"
            className={`mt-8 ${buttonStyles.primary}`}
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

      <div className={`${surfaceStyles.subtle} p-5 sm:p-6`}>
        <p className="text-lg font-semibold leading-8 text-[#332f2a] sm:text-xl">
          {question.text}
        </p>
      </div>

      <div className="grid gap-2.5 sm:gap-3">
        {likertOptions.map((option) => {
          const isSelected = selectedAnswer === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => selectAnswer(option.value)}
              aria-pressed={isSelected}
              className={`flex min-h-14 items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88] ${
                isSelected
                  ? "border-[#9caf88] bg-[#e9efe4] text-[#2f3a2b]"
                  : "border-stone-200 bg-white/64 text-stone-600 hover:bg-white hover:text-stone-800"
              }`}
            >
              <span className="text-sm font-semibold">{option.label}</span>
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm ${
                  isSelected
                    ? "bg-white/85 text-[#4f6348]"
                    : "bg-[#f7f4ee] text-stone-500"
                }`}
              >
                {option.value}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={currentQuestionIndex === 0}
          className={buttonStyles.secondary}
        >
          Back
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!selectedAnswer}
          className={buttonStyles.primary}
        >
          {isFinalQuestion ? "See reflection" : "Next"}
        </button>
      </div>
    </SoftCard>
  );
}
