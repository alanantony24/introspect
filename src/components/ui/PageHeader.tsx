type PageHeaderProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>;

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div>
      <p className="text-sm font-medium uppercase text-stone-400">{eyebrow}</p>
      <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-stone-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">
        {description}
      </p>
    </div>
  );
}
