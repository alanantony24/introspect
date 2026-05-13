import Link from "next/link";

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <div className="rounded-lg bg-white/70 p-8 shadow-sm ring-1 ring-[#dfe6dc] sm:p-10">
        <p className="text-sm font-medium uppercase text-stone-400">
          Dashboard
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Welcome back to a softer check-in.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">
          Your answers may suggest patterns over time. For now, this dashboard
          is a quiet placeholder for assessment progress, recent entries, and
          saved reflections.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/assessment"
          className="rounded-lg bg-white/65 p-6 shadow-sm ring-1 ring-[#dfe6dc] transition hover:bg-white"
        >
          <p className="text-sm font-semibold text-stone-900">
            Continue assessment
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            A short reflection flow will live here.
          </p>
        </Link>
        <Link
          href="/journal"
          className="rounded-lg bg-white/65 p-6 shadow-sm ring-1 ring-[#dfe6dc] transition hover:bg-white"
        >
          <p className="text-sm font-semibold text-stone-900">
            Open journal
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            A spacious writing surface will come next.
          </p>
        </Link>
      </div>
    </section>
  );
}
