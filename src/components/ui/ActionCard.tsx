import Link from "next/link";

import { surfaceStyles } from "@/lib/design";

type ActionCardProps = Readonly<{
  href: string;
  title: string;
  description: string;
}>;

export function ActionCard({ href, title, description }: ActionCardProps) {
  return (
    <Link
      href={href}
      className={`${surfaceStyles.panel} group block p-5 transition hover:-translate-y-0.5 hover:bg-white/82 hover:shadow-[0_16px_40px_rgba(72,63,51,0.07)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88]`}
    >
      <p className="text-sm font-semibold text-stone-800 transition group-hover:text-[#4f6348]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
    </Link>
  );
}
