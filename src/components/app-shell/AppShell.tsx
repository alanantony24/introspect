import Link from "next/link";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", marker: "D" },
  { href: "/onboarding", label: "Onboarding", marker: "O" },
  { href: "/assessment", label: "Assessment", marker: "A" },
  { href: "/journal", label: "Journal", marker: "J" },
  { href: "/insights", label: "Insights", marker: "I" },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f6f7f4] text-stone-800">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
        <aside className="hidden w-72 shrink-0 border-r border-[#dfe6dc] px-8 py-8 md:flex md:flex-col">
          <Link href="/dashboard" className="group">
            <p className="text-sm font-medium uppercase text-stone-400">
              Introspect
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-stone-900">
              A quiet place to notice patterns.
            </h1>
          </Link>

          <nav className="mt-12 flex flex-col gap-2" aria-label="Primary">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-stone-600 transition hover:bg-white/70 hover:text-stone-950"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-white text-xs text-stone-500 shadow-sm ring-1 ring-stone-200/70">
                  {item.marker}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-lg bg-white/60 p-5 text-sm leading-6 text-stone-500 ring-1 ring-[#dfe6dc]">
            This space is designed as a mirror, not an oracle.
          </div>
        </aside>

        <main className="flex-1 px-5 pb-28 pt-6 sm:px-8 md:px-12 md:py-10">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </main>

        <nav
          className="fixed inset-x-0 bottom-0 z-10 border-t border-[#dfe6dc] bg-[#f6f7f4]/95 px-3 py-3 backdrop-blur md:hidden"
          aria-label="Primary"
        >
          <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[0.7rem] font-medium text-stone-600 transition hover:bg-white/70 hover:text-stone-950"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-white text-[0.65rem] text-stone-500 shadow-sm ring-1 ring-stone-200/70">
                  {item.marker}
                </span>
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
