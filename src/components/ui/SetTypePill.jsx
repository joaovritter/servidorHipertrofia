import { SET_TYPE_MAP } from "../../data/constants.js";

export default function SetTypePill({ type }) {
  const t = SET_TYPE_MAP[type];
  if (!t) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${t.color} ${t.bg} ${t.border}`}>
      {t.short} {t.label}
    </span>
  );
}
