export default function Btn({ children, variant = "primary", onClick, className = "", disabled = false, size = "md", type = "button" }) {
  const base = "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-150 cursor-pointer select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50";
  const sizes = { xs: "px-2.5 py-1 text-xs", sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3.5 text-sm" };
  const variants = {
    primary:   "bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20",
    secondary: "bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 disabled:opacity-40",
    ghost:     "text-zinc-400 hover:text-white hover:bg-zinc-800/80 disabled:opacity-40",
    danger:    "bg-red-900/30 text-red-400 border border-red-800/60 hover:bg-red-800/40",
    warning:   "bg-amber-900/30 text-amber-400 border border-amber-800/60 hover:bg-amber-800/40",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
