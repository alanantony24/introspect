type PageHeaderProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>;

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div>
      <p className="inline-flex rounded-full border border-stone-200 bg-white/60 px-3 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[#7a7167]">
        {eyebrow}
      </p>
      <h2 className="mt-4 max-w-2xl font-serif text-3xl italic leading-tight text-[#473623] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-[0.98rem] leading-7 text-stone-600">
        {description}
      </p>
    </div>
  );
}
