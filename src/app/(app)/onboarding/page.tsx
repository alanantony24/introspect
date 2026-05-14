"use client";

import Link from "next/link";
import { useState } from "react";

import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

const onboardingSteps = [
  {
    question: "What brings you here?",
    options: [
      "Understand myself better",
      "Process emotions",
      "Break repeating patterns",
      "Make sense of relationships",
      "Build a reflection habit",
    ],
  },
  {
    question: "What area feels most unclear right now?",
    options: [
      "Self-worth",
      "Relationships",
      "Career or studies",
      "Family",
      "Emotions",
      "Direction in life",
    ],
  },
  {
    question: "What kind of support would feel useful?",
    options: [
      "Gentle reflection",
      "Direct questions",
      "Pattern spotting",
      "Small action steps",
    ],
  },
  {
    question: "How often do you want to reflect?",
    options: ["Daily", "A few times a week", "Weekly", "Only when I need it"],
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const step = onboardingSteps[currentStep];
  const answerKey = `step${currentStep + 1}`;
  const selectedOption = answers[answerKey];
  const isFinalStep = currentStep === onboardingSteps.length - 1;

  function selectOption(option: string) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [answerKey]: option,
    }));
  }

  function goBack() {
    setCurrentStep((stepIndex) => Math.max(stepIndex - 1, 0));
  }

  function continueOnboarding() {
    if (!selectedOption) {
      return;
    }

    if (!isFinalStep) {
      setCurrentStep((stepIndex) => stepIndex + 1);
      return;
    }

    const onboardingData = onboardingSteps.map((onboardingStep, index) => ({
      question: onboardingStep.question,
      answer: answers[`step${index + 1}`],
    }));

    window.localStorage.setItem(
      "introspect:onboarding",
      JSON.stringify({
        completedAt: new Date().toISOString(),
        answers: onboardingData,
      }),
    );
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <SoftCard>
        <div className="space-y-8">
          <PageHeader
            eyebrow="Onboarding complete"
            title="You have set a gentle starting point."
            description="Your answers have been saved on this device. One possible next step is to begin with a simple dashboard check-in."
          />

          <Link
            href="/dashboard"
            className="inline-flex rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Go to dashboard
          </Link>
        </div>
      </SoftCard>
    );
  }

  return (
    <SoftCard className="space-y-8">
      <PageHeader
        eyebrow={`Step ${currentStep + 1} of ${onboardingSteps.length}`}
        title={step.question}
        description="Choose the answer that feels closest right now. You can adjust your direction later."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {step.options.map((option) => {
          const isSelected = selectedOption === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => selectOption(option)}
              aria-pressed={isSelected}
              className={`min-h-24 rounded-lg p-5 text-left text-sm font-medium leading-6 shadow-sm ring-1 transition ${
                isSelected
                  ? "bg-stone-900 text-white ring-stone-900"
                  : "bg-white/65 text-stone-700 ring-[#dfe6dc] hover:bg-white hover:text-stone-950"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#dfe6dc] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={currentStep === 0}
          className="rounded-lg px-5 py-3 text-sm font-semibold text-stone-600 transition hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>

        <button
          type="button"
          onClick={continueOnboarding}
          disabled={!selectedOption}
          className="rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {isFinalStep ? "Finish onboarding" : "Continue"}
        </button>
      </div>
    </SoftCard>
  );
}
