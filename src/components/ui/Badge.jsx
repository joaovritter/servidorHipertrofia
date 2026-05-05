export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default:  "bg-zinc-800 text-zinc-400 border-zinc-700",
    emerald:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
    blue:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
    red:      "bg-red-500/10 text-red-400 border-red-500/20",
    purple:   "bg-purple-500/10 text-purple-400 border-purple-500/20",
    zinc:     "bg-zinc-700/50 text-zinc-300 border-zinc-600",
  };
  return (
    <span className={`inline-flex items-center border px-2 py-0.5 rounded-lg text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
