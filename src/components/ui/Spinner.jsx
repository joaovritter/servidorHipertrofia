export default function Spinner({ size = 20, className = "" }) {
  return (
    <div style={{ width: size, height: size, borderWidth: 2 }}
      className={`rounded-full border-zinc-700 border-t-emerald-400 animate-spin flex-shrink-0 ${className}`} />
  );
}
