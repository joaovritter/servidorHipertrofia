export default function Card({ children, className = "", onClick, glow = false }) {
  return (
    <div onClick={onClick}
      className={`bg-[#1a1a1a] border rounded-2xl transition-all ${
        glow ? "border-emerald-500/30 shadow-lg shadow-emerald-500/5" :
        onClick ? "border-zinc-800 hover:border-zinc-700 cursor-pointer" : "border-zinc-800"
      } ${className}`}>
      {children}
    </div>
  );
}
