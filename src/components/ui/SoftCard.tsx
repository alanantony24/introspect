import type { ReactNode } from "react";

import { surfaceStyles } from "@/lib/design";

type SoftCardProps = Readonly<{
  children: ReactNode;
  className?: string;
  variant?: "paper" | "notebook" | "sticky" | "dashed";
}>;

export function SoftCard({
  children,
  className = "",
  variant = "paper",
}: SoftCardProps) {
  const variantClassName =
    variant === "sticky"
      ? "bg-[#fff8dc]/80"
      : variant === "notebook"
        ? "bg-[#fffefa]/82 notebook-lines"
        : variant === "dashed"
          ? "!border-dashed !border-[#d4cdc3]"
          : "";

  return (
    <section
      className={`${surfaceStyles.card} ${variantClassName} p-6 sm:p-8 ${className}`}
    >
      {children}
    </section>
  );
}
