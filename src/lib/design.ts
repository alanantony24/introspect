export const surfaceStyles = {
  card: "rounded-2xl border border-stone-200/80 bg-white/78 shadow-[0_18px_60px_rgba(72,63,51,0.07)] backdrop-blur",
  panel: "rounded-xl border border-stone-200/75 bg-white/62",
  subtle: "rounded-xl border border-stone-200/70 bg-[#fbfaf6]/72",
};

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center rounded-full bg-[#6f7f66] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#61725a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f4ee] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500",
  secondary:
    "inline-flex items-center justify-center rounded-full border border-stone-200 bg-white/72 px-5 py-2.5 text-sm font-semibold text-stone-600 transition hover:border-stone-300 hover:bg-white hover:text-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f4ee] disabled:cursor-not-allowed disabled:opacity-45",
};

export const chipStyles = {
  base: "rounded-full border px-3.5 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f4ee]",
  selected: "border-[#9caf88] bg-[#e9efe4] text-[#2f3a2b]",
  unselected: "border-stone-200 bg-white/70 text-stone-600 hover:bg-white",
};
