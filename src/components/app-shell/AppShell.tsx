import Link from "next/link";

import { AppNavLink } from "@/components/app-shell/AppNavLink";
import { signOut } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/server";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", marker: "D" },
  { href: "/onboarding", label: "Onboarding", marker: "O" },
  { href: "/assessment", label: "Assessment", marker: "A" },
  { href: "/journal", label: "Journal", marker: "J" },
  { href: "/insights", label: "Insights", marker: "I" },
];

async function AuthStatus() {
  let email: string | undefined;
  let isConfigured = true;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    email = user?.email;
  } catch {
    isConfigured = false;
  }

  if (!isConfigured) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white/55 p-4 text-sm leading-6 text-stone-500">
        Supabase env not configured.
      </div>
    );
  }

  if (!email) {
    return (
      <Link
        href="/login"
        className="inline-flex w-full items-center justify-center rounded-full border border-stone-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-white hover:text-[#4f6348] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88]"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white/55 p-4">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-stone-400">
        Signed in
      </p>
      <p className="mt-2 truncate text-sm text-stone-700">{email}</p>
      <form action={signOut} className="mt-3">
        <button
          type="submit"
          className="text-sm font-semibold text-[#65755d] transition hover:text-[#4f6348] focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#9caf88]"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

export async function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-stone-800">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
        <aside className="hidden w-72 shrink-0 px-5 py-6 md:flex md:flex-col">
          <div className="flex min-h-full flex-col rounded-[1.5rem] border border-white/65 bg-white/38 p-5 shadow-[0_18px_70px_rgba(72,63,51,0.06)] backdrop-blur">
          <Link href="/dashboard" className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
              Introspect
            </p>
            <h1 className="mt-3 text-xl font-semibold leading-7 text-[#332f2a]">
              A quiet place to notice patterns.
            </h1>
          </Link>

          <nav className="mt-10 flex flex-col gap-1.5" aria-label="Primary">
            {navigationItems.map((item) => (
              <AppNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                marker={item.marker}
              />
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <AuthStatus />
            <div className="rounded-xl border border-stone-200 bg-white/45 p-4 text-sm leading-6 text-stone-500">
              This space is designed as a mirror, not an oracle.
            </div>
          </div>
          </div>
        </aside>

        <main className="flex-1 px-5 pb-28 pt-5 sm:px-8 md:px-10 md:py-8">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-5 md:hidden">
              <AuthStatus />
            </div>
            {children}
          </div>
        </main>

        <nav
          className="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-[#f7f4ee]/92 px-3 py-3 backdrop-blur md:hidden"
          aria-label="Primary"
        >
          <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
            {navigationItems.map((item) => (
              <AppNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                marker={item.marker}
                compact
              />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
