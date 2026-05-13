import type { ReactNode } from "react";

type SoftCardProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function SoftCard({ children, className = "" }: SoftCardProps) {
  return (
    <section
      className={`rounded-lg bg-white/70 p-8 shadow-sm ring-1 ring-[#dfe6dc] sm:p-10 ${className}`}
    >
      {children}
    </section>
  );
}
