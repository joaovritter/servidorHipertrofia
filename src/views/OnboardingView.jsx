import React, { useState } from "react";
import { Dumbbell, ChevronRight, ChevronLeft, ArrowRight, Check, ChevronUp, ChevronDown } from "lucide-react";
import Btn from "../components/ui/Btn.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { EXERCISE_BANK } from "../data/exerciseBank.js";
import { MUSCLE_GROUPS } from "../data/constants.js";

export default function OnboardingView({ onComplete }) {
  const [step, setStep] = useState(1);
  const TOTAL = 3;

  // Step 1: Perfil do atleta
  const [profile, setProfile] = useState({
    weight: "82", height: "178", age: "28",
    goal: "Hipertrofia Máxima", experience: "Avançado (5+ anos)",
    injuries: "Manguito rotador dir. (2022, recuperado)",
  });

  // Step 2: Divisão semanal
  const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const [division, setDivision] = useState({
    0: [],
    1: ["chest", "shoulders", "triceps"],
    2: ["back", "biceps"],
    3: ["legs"],
    4: [],
    5: ["chest", "triceps"],
    6: ["back", "shoulders", "biceps"],
  });

  const getDivisionName = (muscles) => {
    if (!muscles || muscles.length === 0) return "Descanso Ativo";
    return muscles.map(id => MUSCLE_GROUPS.find(m => m.id === id)?.label || id).join(", ");
  };

  const toggleMuscleForDay = (dayIdx, muscleId) => {
    setDivision(prev => {
      const cur = prev[dayIdx] || [];
      return { ...prev, [dayIdx]: cur.includes(muscleId) ? cur.filter(x => x !== muscleId) : [...cur, muscleId] };
    });
  };

  const [editingDay, setEditingDay] = useState(null);

  // Step 3: Seleção de exercícios
  const [selectedExercises, setSelectedExercises] = useState({
    1: ["ex_bp","ex_ibp","ex_fly","ex_tpu","ex_fra"],
    2: ["ex_row","ex_pd","ex_cr","ex_bcb","ex_bch"],
    4: ["ex_ohp","ex_dlat","ex_rr"],
    5: ["ex_sq","ex_lp","ex_rdl","ex_leg","ex_curl"],
  });
  const [activeDay, setActiveDay] = useState(1);

  const strengthDays = Object.entries(division)
    .filter(([_, v]) => Array.isArray(v) && v.length > 0)
    .map(([k]) => parseInt(k));

  const allExercises = Object.values(EXERCISE_BANK).flat();
  
  const toggleExercise = (dayIdx, exId) => {
    setSelectedExercises(prev => {
      const cur = prev[dayIdx] || [];
      return { ...prev, [dayIdx]: cur.includes(exId) ? cur.filter(x => x !== exId) : [...cur, exId] };
    });
  };

  const STEP_NAMES = ["Perfil do Atleta", "Divisão Semanal", "Banco de Exercícios"];

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center relative overflow-hidden py-10">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Dumbbell size={16} className="text-black" />
          </div>
          <div>
            <h1 className="text-white font-black text-lg">Configuração Inicial</h1>
            <p className="text-zinc-500 text-xs">Passo {step} de {TOTAL} — {STEP_NAMES[step - 1]}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? "bg-emerald-500" : "bg-zinc-800"}`} />
          ))}
        </div>

        <Card className="p-6 mb-5">

          {/* ── STEP 1: Perfil ── */}
          {step === 1 && (
            <>
              <h2 className="text-white font-black text-xl mb-1">Perfil do Atleta</h2>
              <p className="text-zinc-500 text-sm mb-6">Essas informações personalizam os limites de volume (MEV, MAV, MRV) e a periodização automática.</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { l: "Peso Corporal (kg)", k: "weight", type: "number" },
                  { l: "Altura (cm)",        k: "height", type: "number" },
                  { l: "Idade",              k: "age",    type: "number" },
                ].map(f => (
                  <div key={f.k}>
                    <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-widest">{f.l}</label>
                    <input type={f.type} value={profile[f.k]}
                      onChange={e => setProfile({...profile, [f.k]: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-widest">Objetivo Principal</label>
                  <select value={profile.goal} onChange={e => setProfile({...profile, goal: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors">
                    {["Hipertrofia Máxima","Força Máxima","Recomposição Corporal","Resistência Muscular"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-widest">Nível de Experiência</label>
                  <select value={profile.experience} onChange={e => setProfile({...profile, experience: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors">
                    {["Intermediário (2–4 anos)","Avançado (5+ anos)","Elite (competidor)"].map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-widest">Histórico de Lesões</label>
                  <input type="text" value={profile.injuries} placeholder="Ex: Manguito rotador direito (2022), joelho esquerdo"
                    onChange={e => setProfile({...profile, injuries: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder-zinc-700 transition-colors" />
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: Divisão semanal ── */}
          {step === 2 && (
            <>
              <h2 className="text-white font-black text-xl mb-1">Divisão Semanal</h2>
              <p className="text-zinc-500 text-sm mb-6">
                Monte cada dia combinando múltiplos grupamentos musculares. Dias sem seleção serão marcados como Descanso.
              </p>
              <div className="space-y-2">
                {DAY_LABELS.map((d, i) => {
                  const dayMuscles = division[i] || [];
                  const isEditing = editingDay === i;
                  const dayName = getDivisionName(dayMuscles);
                  return (
                    <div key={i}>
                      <button onClick={() => setEditingDay(isEditing ? null : i)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          isEditing ? "bg-emerald-500/5 border-emerald-500/30" :
                          dayMuscles.length > 0 ? "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600" :
                          "bg-zinc-800/30 border-zinc-800 hover:border-zinc-700"
                        }`}>
                        <span className={`text-xs font-bold w-7 text-right flex-shrink-0 ${
                          isEditing ? "text-emerald-400" : "text-zinc-500"
                        }`}>{d}</span>
                        <span className={`flex-1 text-sm truncate ${
                          dayMuscles.length > 0 ? "text-white font-medium" : "text-zinc-600 italic"
                        }`}>{dayName}</span>
                        <span className="text-zinc-600 text-xs">{dayMuscles.length > 0 ? `${dayMuscles.length} grupo(s)` : ""}</span>
                        {isEditing ? <ChevronUp size={13} className="text-emerald-400" /> : <ChevronDown size={13} className="text-zinc-600" />}
                      </button>
                      {isEditing && (
                        <div className="mt-1.5 ml-10 grid grid-cols-3 gap-1.5 p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl">
                          {MUSCLE_GROUPS.map(mg => {
                            const sel = dayMuscles.includes(mg.id);
                            return (
                              <button key={mg.id} onClick={() => toggleMuscleForDay(i, mg.id)}
                                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs font-semibold transition-all ${
                                  sel ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" :
                                  "bg-zinc-800/60 border-zinc-700/50 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                                }`}>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                  sel ? "bg-emerald-500 border-emerald-500" : "border-zinc-600"
                                }`}>
                                  {sel && <Check size={9} className="text-black" strokeWidth={3} />}
                                </div>
                                <span>{mg.icon} {mg.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── STEP 3: Seleção de exercícios ── */}
          {step === 3 && (
            <>
              <h2 className="text-white font-black text-xl mb-1">Banco de Exercícios</h2>
              <p className="text-zinc-500 text-sm mb-5">Selecione os exercícios para cada dia de treino. Esta lista pode ser editada antes de qualquer sessão.</p>

              {/* Abas por dia de treino */}
              <div className="flex gap-1.5 mb-5 flex-wrap">
                {strengthDays.map(d => (
                  <button key={d} onClick={() => setActiveDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      activeDay === d ? "bg-emerald-500 border-emerald-500 text-black" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                    }`}>
                    {DAY_LABELS[d]} — {getDivisionName(division[d])}
                  </button>
                ))}
              </div>

              {/* Lista de exercícios disponíveis */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {allExercises.map(ex => {
                  const sel = (selectedExercises[activeDay] || []).includes(ex.id);
                  return (
                    <button key={ex.id} onClick={() => toggleExercise(activeDay, ex.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                        sel ? "bg-emerald-500/10 border-emerald-500/30" : "bg-zinc-800/50 border-zinc-800 hover:border-zinc-700"
                      }`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        sel ? "bg-emerald-500 border-emerald-500" : "border-zinc-600"
                      }`}>
                        {sel && <Check size={11} className="text-black" strokeWidth={3} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${sel ? "text-emerald-300" : "text-zinc-300"}`}>{ex.name}</p>
                        <p className="text-zinc-600 text-xs">{ex.muscles[0]} · {ex.equipment}</p>
                      </div>
                      <Badge variant={ex.type === "compound" ? "amber" : "default"}>
                        {ex.type === "compound" ? "Composto" : "Isolado"}
                      </Badge>
                    </button>
                  );
                })}
              </div>

              <p className="text-zinc-600 text-xs mt-3 text-right">
                {(selectedExercises[activeDay] || []).length} exercício(s) selecionado(s) para {DAY_LABELS[activeDay]}
              </p>
            </>
          )}
        </Card>

        {/* Navegação */}
        <div className="flex justify-between">
          <Btn variant="ghost" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
            <ChevronLeft size={14} /> Voltar
          </Btn>
          {step < TOTAL
            ? <Btn variant="primary" onClick={() => setStep(s => s + 1)}>Próximo <ChevronRight size={14} /></Btn>
            : <Btn variant="primary" size="lg" onClick={onComplete}>Iniciar o Sistema <ArrowRight size={14} /></Btn>
          }
        </div>
      </div>
    </div>
  );
}
