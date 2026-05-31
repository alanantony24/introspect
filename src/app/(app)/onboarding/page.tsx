"use client";

import Link from "next/link";
import { useState } from "react";

import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { buttonStyles } from "@/lib/design";

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
            className={buttonStyles.primary}
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
              className={`min-h-20 rounded-xl border p-5 text-left text-sm font-medium leading-6 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88] ${
                isSelected
                  ? "border-[#9caf88] bg-[#e9efe4] text-[#2f3a2b]"
                  : "border-stone-200 bg-white/64 text-stone-600 hover:bg-white hover:text-stone-800"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={currentStep === 0}
          className={buttonStyles.secondary}
        >
          Back
        </button>

        <button
          type="button"
          onClick={continueOnboarding}
          disabled={!selectedOption}
          className={buttonStyles.primary}
        >
          {isFinalStep ? "Finish onboarding" : "Continue"}
        </button>
      </div>
    </SoftCard>
  );
}
