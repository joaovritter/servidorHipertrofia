import React from "react";
import { Play, Calendar, Clock, ArrowRight, Dumbbell, SquareStack, TrendingUp, Target, BookOpen } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Btn from "../components/ui/Btn.jsx";
import Badge from "../components/ui/Badge.jsx";
import { MOCK_USER, MOCK_DIVISION } from "../data/constants.js";

export default function DashboardView({ setView }) {
  // Fixa segunda-feira para o protótipo (em prod: new Date().getDay())
  const todayIdx = 1;
  const todaySession = MOCK_DIVISION[todayIdx];
  const DAY_FULL  = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
  const DAY_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

  const WEEK_STATS = [
    { label: "Treinos esta semana", value: "3",      sub: "de 5 planejados", icon: Dumbbell,    color: "text-emerald-400" },
    { label: "Work Sets Totais",    value: "94",     sub: "séries efetivas", icon: SquareStack,  color: "text-blue-400"    },
    { label: "Volume Total",        value: "48.2",   sub: "toneladas (kg)",  icon: TrendingUp,   color: "text-amber-400"   },
    { label: "Carga Média",         value: "78.5",   sub: "kg por série",    icon: Target,       color: "text-purple-400"  },
  ];

  const RECENT = [
    { date: "Sex 16/05", name: "Peito & Tríceps",         dur: "68 min", workSets: 13, type: "strength" },
    { date: "Qui 15/05", name: "Costas, Ombro & Bíceps", dur: "72 min", workSets: 14, type: "strength" },
    { date: "Qua 14/05", name: "Pernas",                  dur: "82 min", workSets: 15, type: "strength" },
    { date: "Ter 13/05", name: "Costas & Bíceps",         dur: "66 min", workSets: 12, type: "strength" },
  ];

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-7">
          <p className="text-zinc-600 text-sm">{DAY_FULL[todayIdx]} · 19 de Maio de 2025</p>
          <h1 className="text-2xl font-black text-white mt-0.5">Bom dia, {MOCK_USER.name.split(" ")[0]} 👋</h1>
        </div>

        {/* CARD DE TREINO DO DIA — CTA principal */}
        <Card glow className="p-6 mb-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-5 bg-emerald-400 rounded-full" />
                <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">Treino de Hoje</p>
              </div>
              <h2 className="text-3xl font-black text-white mb-3">{todaySession.name}</h2>
              <div className="flex gap-2 flex-wrap mb-5">
                <Badge variant="emerald">Hipertrofia</Badge>
                <Badge variant="zinc">5 exercícios</Badge>
                <Badge variant="zinc">13 work sets</Badge>
                <Badge variant="amber">~70 min</Badge>
              </div>
              <div className="flex gap-3">
                <Btn variant="primary" size="lg" onClick={() => setView("workout")}>
                  <Play size={16} fill="currentColor" /> Iniciar Treino
                </Btn>
                <Btn variant="secondary" onClick={() => setView("workout")}>
                  <BookOpen size={14} /> Ver Ficha
                </Btn>
              </div>
            </div>
            {/* Mini-visualização dos grupos musculares */}
            <div className="hidden lg:block flex-shrink-0">
              <div className="bg-zinc-800/80 rounded-2xl p-5 border border-zinc-700/60">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Grupos Alvo</p>
                {["Peitoral","Peitoral Superior","Tríceps","Tríceps Longo"].map(m => (
                  <div key={m} className="flex items-center gap-2 mb-2 last:mb-0">
                    <div className="w-1 h-3 bg-emerald-400 rounded-full" />
                    <span className="text-zinc-300 text-xs">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Métricas semanais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {WEEK_STATS.map(s => (
            <Card key={s.label} className="p-4">
              <s.icon size={14} className={`${s.color} mb-3`} />
              <p className={`text-2xl font-black ${s.color} leading-none`}>{s.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{s.sub}</p>
              <p className="text-zinc-700 text-xs mt-1.5">{s.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Divisão semanal */}
          <Card className="md:col-span-2 p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Calendar size={13} className="text-zinc-500" /> Divisão Semanal
            </h3>
            <div className="space-y-1">
              {DAY_SHORT.map((d, i) => {
                const isToday = i === todayIdx;
                const info = MOCK_DIVISION[i];
                return (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                    isToday ? "bg-emerald-500/10 border border-emerald-500/15" : "hover:bg-zinc-800/40"
                  }`}>
                    <span className={`text-xs font-bold w-6 text-center ${isToday ? "text-emerald-400" : "text-zinc-700"}`}>{d}</span>
                    <span className={`flex-1 text-xs truncate ${isToday ? "text-white font-semibold" : "text-zinc-500"}`}>{info.name}</span>
                    {isToday && <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">HOJE</span>}
                    {!isToday && info.type === "rest" && <span className="text-xs text-zinc-700">—</span>}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Sessões recentes */}
          <Card className="md:col-span-3 p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Clock size={13} className="text-zinc-500" /> Sessões Recentes
            </h3>
            <div className="divide-y divide-zinc-800/60">
              {RECENT.map((s, i) => (
                <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-emerald-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{s.name}</p>
                    <p className="text-zinc-600 text-xs">{s.date} · {s.dur}</p>
                  </div>
                  {s.workSets != null && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-zinc-300 text-xs font-mono font-bold">{s.workSets}</p>
                      <p className="text-zinc-600 text-[10px]">work sets</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setView("calendar")}
              className="w-full mt-3 py-2 text-center text-emerald-400 text-xs hover:underline flex items-center justify-center gap-1">
              Ver calendário completo <ArrowRight size={11} />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
