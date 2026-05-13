import Link from "next/link";

type ActionCardProps = Readonly<{
  href: string;
  title: string;
  description: string;
}>;

export function ActionCard({ href, title, description }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-white/65 p-6 shadow-sm ring-1 ring-[#dfe6dc] transition hover:bg-white"
    >
      <p className="text-sm font-semibold text-stone-900">{title}</p>
      <p className="mt-3 text-sm leading-6 text-stone-500">{description}</p>
    </Link>
  );
}
