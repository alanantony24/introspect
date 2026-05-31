"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AppNavLinkProps = Readonly<{
  href: string;
  label: string;
  marker: string;
  compact?: boolean;
}>;

export function AppNavLink({
  href,
  label,
  marker,
  compact = false,
}: AppNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  if (compact) {
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[0.7rem] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88] ${
          isActive
            ? "bg-white text-[#4f6348] shadow-sm"
            : "text-stone-500 hover:bg-white/70 hover:text-stone-800"
        }`}
      >
        <span
          className={`flex size-7 items-center justify-center rounded-full text-[0.65rem] ${
            isActive ? "bg-[#e9efe4]" : "bg-white/70"
          }`}
        >
          {marker}
        </span>
        <span className="max-w-full truncate">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88] ${
        isActive
          ? "bg-white/82 text-[#384633] shadow-sm"
          : "text-stone-500 hover:bg-white/60 hover:text-stone-800"
      }`}
    >
      <span
        className={`flex size-7 items-center justify-center rounded-full text-[0.7rem] transition ${
          isActive
            ? "bg-[#e9efe4] text-[#4f6348]"
            : "bg-white/65 text-stone-400 group-hover:text-stone-600"
        }`}
      >
        {marker}
      </span>
      {label}
    </Link>
  );
}
