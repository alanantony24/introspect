import Link from "next/link";
import { Card } from "sketchbook-ui";

type ActionCardProps = Readonly<{
  href: string;
  title: string;
  description: string;
}>;

export function ActionCard({ href, title, description }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-lg transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
    >
      <Card
        className="introspect-action-card"
        colors={{
          bg: "#fffefa",
          bgOverlay: "#f6f7f4",
          stroke: "#b8aa96",
          text: "#292524",
        }}
        typography={{ fontFamily: "var(--font-geist-sans)" }}
      >
        <p className="text-sm font-semibold text-stone-900">{title}</p>
        <p className="mt-3 text-sm leading-6 text-stone-500">{description}</p>
      </Card>
    </Link>
  );
}
