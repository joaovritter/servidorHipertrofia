import React, { useState } from "react";
import { BarChart3, TrendingUp, SquareStack, Dumbbell } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, ReferenceLine
} from "recharts";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { VOLUME_DATA, ONE_RM_DATA } from "../data/constants.js";

export default function ReportsView() {
  const [tab,    setTab]    = useState("volume");
  const [active, setActive] = useState(["Peitoral","Costas","Pernas"]);
  const [rmEx,   setRmEx]   = useState("bp");
  const [period, setPeriod] = useState("mes"); 
  const [viewMode, setViewMode] = useState("muscle");

  const MUSCLES = ["Peitoral","Costas","Pernas","Ombros","Braços"];
  const COLORS  = { Peitoral:"#10b981", Costas:"#3b82f6", Pernas:"#8b5cf6", Ombros:"#f59e0b", Braços:"#f43f5e" };

  const DIVISION_NAMES = ["Peito, Ombro & Tríceps", "Costas & Bíceps", "Pernas"];
  const DIV_COLORS = { "Peito, Ombro & Tríceps":"#10b981", "Costas & Bíceps":"#3b82f6", "Pernas":"#8b5cf6" };
  const DIVISION_VOLUME = VOLUME_DATA.map(d => ({
    sem: d.sem,
    "Peito, Ombro & Tríceps": d.Peitoral + d.Ombros + (d.Braços || 0),
    "Costas & Bíceps": d.Costas + (d.Braços || 0),
    "Pernas": d.Pernas,
  }));

  const LOAD_DATA = [
    { sem:"S1", Peitoral:72, Costas:65, Pernas:95, Ombros:35, Braços:22 },
    { sem:"S2", Peitoral:74, Costas:67, Pernas:97, Ombros:36, Braços:23 },
    { sem:"S3", Peitoral:76, Costas:69, Pernas:100, Ombros:37, Braços:24 },
    { sem:"S4", Peitoral:70, Costas:62, Pernas:90, Ombros:33, Braços:20 },
    { sem:"S5", Peitoral:78, Costas:71, Pernas:102, Ombros:38, Braços:25 },
    { sem:"S6", Peitoral:78, Costas:72, Pernas:105, Ombros:39, Braços:25 },
    { sem:"S7", Peitoral:80, Costas:74, Pernas:108, Ombros:40, Braços:26 },
    { sem:"S8", Peitoral:72, Costas:66, Pernas:92, Ombros:34, Braços:21 },
    { sem:"S9", Peitoral:82, Costas:76, Pernas:110, Ombros:41, Braços:27 },
    { sem:"S10",Peitoral:83, Costas:77, Pernas:112, Ombros:42, Braços:28 },
    { sem:"S11",Peitoral:85, Costas:78, Pernas:115, Ombros:43, Braços:28 },
    { sem:"S12",Peitoral:85, Costas:80, Pernas:118, Ombros:44, Braços:29 },
  ];

  const tooltipStyle = {
    backgroundColor: "#1a1a1a", border: "1px solid #27272a",
    borderRadius: 12, color: "#fff", fontSize: 12, padding: "8px 12px",
  };

  const TABS = [
    { id: "volume",      label: "Volume (Work Sets)",  icon: BarChart3  },
    { id: "load",        label: "Carga Média (kg)",    icon: TrendingUp },
    { id: "progression", label: "1RM Estimada",        icon: TrendingUp },
  ];

  const PERIODS = [
    { id: "semana", label: "Semana" },
    { id: "mes",    label: "Mês" },
    { id: "ano",    label: "Ano" },
  ];

  const SUMMARY = [
    { l: "Work Sets (12 sem)", v: "1.186", u: "séries",  c: "text-emerald-400", icon: SquareStack },
    { l: "Sessões Totais",     v: "68",    u: "treinos",  c: "text-blue-400",    icon: Dumbbell    },
    { l: "1RM Supino (atual)", v: "110",   u: "kg",       c: "text-amber-400",   icon: TrendingUp  },
    { l: "1RM Squat (atual)",  v: "145",   u: "kg",       c: "text-purple-400",  icon: TrendingUp  },
  ];

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white">Relatórios Avançados</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Volume baseado apenas em <Badge variant="emerald" className="inline mx-1">Work Sets</Badge> — últimas 12 semanas
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {SUMMARY.map(s => (
            <Card key={s.l} className="p-4">
              <s.icon size={14} className={`${s.c} mb-3`} />
              <p className={`text-2xl font-black ${s.c} leading-none`}>{s.v}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{s.u}</p>
              <p className="text-zinc-700 text-xs mt-1.5 leading-snug">{s.l}</p>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div className="flex gap-1 bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-1 w-fit">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  tab === t.id ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}>
                <t.icon size={13} /> {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5 bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden">
              {PERIODS.map(p => (
                <button key={p.id} onClick={() => setPeriod(p.id)}
                  className={`px-3 py-1.5 text-xs font-bold transition-all ${
                    period === p.id ? "bg-emerald-500 text-black" : "text-zinc-500 hover:text-zinc-300"
                  }`}>{p.label}</button>
              ))}
            </div>
            {(tab === "volume" || tab === "load") && (
              <div className="flex gap-0.5 bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden">
                <button onClick={() => setViewMode("muscle")}
                  className={`px-3 py-1.5 text-xs font-bold transition-all ${
                    viewMode === "muscle" ? "bg-blue-500 text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}>Por Músculo</button>
                <button onClick={() => setViewMode("division")}
                  className={`px-3 py-1.5 text-xs font-bold transition-all ${
                    viewMode === "division" ? "bg-blue-500 text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}>Por Divisão</button>
              </div>
            )}
          </div>
        </div>

        {tab === "volume" && (
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
              <div>
                <h3 className="text-white font-bold text-base">
                  {viewMode === "muscle" ? "Volume Semanal por Grupamento Muscular" : "Volume Semanal por Divisão de Treino"}
                </h3>
                <p className="text-zinc-500 text-xs mt-0.5">Séries de trabalho efetivas (Work Sets) · S4 e S8 = semanas de deload</p>
              </div>
              {viewMode === "muscle" && (
                <div className="flex gap-1.5 flex-wrap">
                  {MUSCLES.map(m => (
                    <button key={m} onClick={() => setActive(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold border transition-all"
                      style={active.includes(m)
                        ? { backgroundColor: COLORS[m] + "22", borderColor: COLORS[m], color: COLORS[m] }
                        : { background: "transparent", borderColor: "#3f3f46", color: "#52525b" }}>
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {viewMode === "muscle" ? (
                <BarChart data={VOLUME_DATA} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                  <XAxis dataKey="sem" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#52525b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                  <Legend iconType="circle" iconSize={7}
                    formatter={v => <span style={{ color: "#71717a", fontSize: 11 }}>{v}</span>} />
                  <ReferenceLine y={20} stroke="#27272a" strokeDasharray="4 4" label={{ value: "MEV", fill:"#52525b", fontSize:10 }} />
                  {MUSCLES.filter(m => active.includes(m)).map(m => (
                    <Bar key={m} dataKey={m} fill={COLORS[m]} radius={[3,3,0,0]} maxBarSize={14} />
                  ))}
                </BarChart>
              ) : (
                <BarChart data={DIVISION_VOLUME} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                  <XAxis dataKey="sem" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#52525b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                  <Legend iconType="circle" iconSize={7}
                    formatter={v => <span style={{ color: "#71717a", fontSize: 11 }}>{v}</span>} />
                  {DIVISION_NAMES.map(d => (
                    <Bar key={d} dataKey={d} fill={DIV_COLORS[d]} radius={[3,3,0,0]} maxBarSize={18} />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </Card>
        )}

        {tab === "load" && (
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
              <div>
                <h3 className="text-white font-bold text-base">Evolução de Carga Média por Grupamento</h3>
                <p className="text-zinc-500 text-xs mt-0.5">Peso médio (kg) das work sets por grupamento muscular</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {MUSCLES.map(m => (
                  <button key={m} onClick={() => setActive(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border transition-all"
                    style={active.includes(m)
                      ? { backgroundColor: COLORS[m] + "22", borderColor: COLORS[m], color: COLORS[m] }
                      : { background: "transparent", borderColor: "#3f3f46", color: "#52525b" }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={LOAD_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                <XAxis dataKey="sem" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#52525b", fontSize: 11 }} axisLine={false} tickLine={false} unit=" kg" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={7}
                  formatter={v => <span style={{ color: "#71717a", fontSize: 11 }}>{v}</span>} />
                {MUSCLES.filter(m => active.includes(m)).map(m => (
                  <Line key={m} type="monotone" dataKey={m} stroke={COLORS[m]} strokeWidth={2}
                    dot={{ fill: COLORS[m], strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 6, fill: COLORS[m] }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {tab === "progression" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h3 className="text-white font-bold text-base">Progressão de 1RM Estimada</h3>
                <p className="text-zinc-500 text-xs mt-0.5">Fórmula de Epley: 1RM = peso × (1 + reps/30) · apenas de work sets</p>
              </div>
              <div className="flex gap-1.5">
                {[{ id:"bp", l:"Supino Reto"},{id:"sq",l:"Agachamento"}].map(e => (
                  <button key={e.id} onClick={() => setRmEx(e.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      rmEx === e.id ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "border-zinc-700 text-zinc-500 hover:border-zinc-600"
                    }`}>{e.l}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mb-5 flex-wrap">
              {[
                { l:"Início", v: rmEx === "bp" ? "87.5 kg" : "120 kg" },
                { l:"Atual",  v: rmEx === "bp" ? "110 kg"  : "145 kg" },
                { l:"Delta",  v: rmEx === "bp" ? "+25.7%"  : "+20.8%", highlight: true },
              ].map(s => (
                <div key={s.l} className="bg-zinc-800 rounded-xl px-4 py-2.5 text-center">
                  <p className="text-zinc-500 text-xs">{s.l}</p>
                  <p className={`font-black text-sm mt-0.5 ${s.highlight ? "text-emerald-400" : "text-white"}`}>{s.v}</p>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ONE_RM_DATA}>
                <defs>
                  <linearGradient id="lgrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#52525b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#52525b", fontSize: 11 }} axisLine={false} tickLine={false}
                  domain={rmEx === "bp" ? [82, 115] : [115, 150]} />
                <Tooltip contentStyle={tooltipStyle}
                  formatter={v => [`${v} kg`, rmEx === "bp" ? "Supino 1RM" : "Squat 1RM"]} />
                <Line type="monotone" dataKey={rmEx} stroke="#10b981" strokeWidth={2.5}
                  dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 7, fill: "#10b981" }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
}
