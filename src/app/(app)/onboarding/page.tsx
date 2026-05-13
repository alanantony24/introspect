export default function OnboardingPage() {
  return (
    <section className="rounded-lg bg-white/70 p-8 shadow-sm ring-1 ring-[#dfe6dc] sm:p-10">
      <p className="text-sm font-medium uppercase text-stone-400">
        Onboarding
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
        Begin with context.
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">
        This route will introduce the app boundaries, invite a few grounding
        preferences, and help the experience feel emotionally safe before any
        assessment starts.
      </p>
    </section>
  );
}
