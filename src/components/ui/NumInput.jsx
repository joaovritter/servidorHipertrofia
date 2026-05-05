import { Plus, Minus } from "lucide-react";

export default function NumInput({ value, onChange, step = 1, min = 0, max = 999, suffix = "", disabled = false, highlight = false }) {
  const fmt = v => Number.isInteger(v) ? String(v) : v.toFixed(1);
  return (
    <div className={`flex items-center rounded-xl overflow-hidden border transition-colors ${
      disabled ? "border-zinc-800 opacity-50" :
      highlight ? "border-emerald-500/40 bg-emerald-500/5" : "border-zinc-700 bg-zinc-900"
    }`}>
      <button disabled={disabled}
        onClick={() => onChange(Math.max(min, parseFloat((value - step).toFixed(2))))}
        className="px-2.5 py-2 text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors disabled:pointer-events-none">
        <Minus size={10} />
      </button>
      <span className={`font-mono text-xs font-bold min-w-[48px] text-center select-none ${disabled ? "text-zinc-600" : highlight ? "text-emerald-300" : "text-white"}`}>
        {fmt(value)}{suffix}
      </span>
      <button disabled={disabled}
        onClick={() => onChange(Math.min(max, parseFloat((value + step).toFixed(2))))}
        className="px-2.5 py-2 text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors disabled:pointer-events-none">
        <Plus size={10} />
      </button>
    </div>
  );
}
