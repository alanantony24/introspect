export const surfaceStyles = {
  card: "rounded-2xl border border-stone-200/80 bg-white/78 shadow-[0_18px_60px_rgba(72,63,51,0.07),inset_0_0_0_1px_rgba(71,54,35,0.04)] backdrop-blur",
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
  base: "rounded-full border px-3.5 py-2 text-sm font-medium transition active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9caf88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f4ee]",
  selected: "border-[#9caf88] bg-[#e9efe4] text-[#2f3a2b]",
  unselected: "border-stone-200 bg-white/70 text-stone-600 hover:bg-white",
};

/** Per-mood colour tokens for journal mood chips. */
export const moodColors: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  calm:     { border: "#76c2e8", bg: "#e8f6fb", text: "#1a5d79" },
  anxious:  { border: "#ffaa88", bg: "#fff2ec", text: "#7a3318" },
  hopeful:  { border: "#5cbf95", bg: "#e8f8f1", text: "#1a5c3b" },
  tired:    { border: "#b3b0ef", bg: "#f0eff9", text: "#3e3b7a" },
  confused: { border: "#e8a0a3", bg: "#fdf0f1", text: "#7a2e30" },
  heavy:    { border: "#b3b0ef", bg: "#f0eff9", text: "#3e3b7a" },
  grateful: { border: "#d4b46e", bg: "#fdf6e7", text: "#6b4a0e" },
};
