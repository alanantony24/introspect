import type { ReactNode } from "react";
import { Card } from "sketchbook-ui";

type SoftCardProps = Readonly<{
  children: ReactNode;
  className?: string;
  variant?: "paper" | "notebook" | "sticky";
}>;

export function SoftCard({
  children,
  className = "",
  variant = "paper",
}: SoftCardProps) {
  return (
    <Card
      variant={variant}
      className={`introspect-soft-card ${className}`}
      colors={{
        bg: "#fffefa",
        bgOverlay: "#f6f7f4",
        stroke: "#b8aa96",
        text: "#292524",
      }}
      typography={{ fontFamily: "var(--font-geist-sans)" }}
    >
      {children}
    </Card>
  );
}
