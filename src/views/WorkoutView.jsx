import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Plus, Minus, Lock, Check, ChevronUp, ChevronDown, Info, Brain, Zap, Home, BarChart3, ChevronLeft, AlertTriangle } from "lucide-react";
import Btn from "../components/ui/Btn.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import NumInput from "../components/ui/NumInput.jsx";
import Modal from "../components/ui/Modal.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { SET_TYPES, SET_TYPE_MAP, TODAY_SESSION, AI_FEEDBACK_MOCK } from "../data/constants.js";
import api from "../services/api.js";

export default function WorkoutView({ setView, readOnly = false, sessionData = null }) {
  const session = sessionData || TODAY_SESSION;

  const [exercises, setExercises] = useState(() =>
    session.exercises.map(ex => ({
      ...ex,
      sets: ex.sets.map(s => ({ ...s })),
    }))
  );

  const nextIdRef = useRef(100);

  const initEntries = () => {
    const e = {};
    exercises.forEach(ex => {
      ex.sets.forEach(s => {
        e[s.id] = {
          type:      s.type,
          weight:    s.weight,
          reps:      s.reps,
          rir:       s.rir ?? (s.type === "work" ? 2 : null),
          completed: s.completed,
        };
      });
    });
    return e;
  };

  const [entries, setEntries]   = useState(initEntries);
  const [openEx,  setOpenEx]    = useState(session.exercises[0]?.id);
  const [elapsed, setElapsed]   = useState(0);
  const [rirMode, setRirMode]   = useState(true);
  const [showAI,  setShowAI]    = useState(false);
  const [aiState, setAiState]   = useState("idle");
  const [aiFeedback, setAiFeedback] = useState(AI_FEEDBACK_MOCK);

  useEffect(() => {
    if (readOnly) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [readOnly]);

  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const upd = useCallback((setId, field, val) => {
    if (readOnly) return;
    setEntries(prev => ({ ...prev, [setId]: { ...prev[setId], [field]: val } }));
  }, [readOnly]);

  const { totalSets, completedSets, workSetsTotal, workSetsCompleted } = useMemo(() => {
    const all     = Object.values(entries);
    const work    = all.filter(e => e.type === "work");
    return {
      totalSets:         all.length,
      completedSets:     all.filter(e => e.completed).length,
      workSetsTotal:     work.length,
      workSetsCompleted: work.filter(e => e.completed).length,
    };
  }, [entries]);

  const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  const allDone  = completedSets === totalSets;

  const handleFinish = async () => {
    setShowAI(true);
    setAiState("loading");

    try {
      const allSets = Object.values(entries);
      const res = await api("/workouts/session/1/finish", {
        method: "POST",
        body: {
          sessionName: session.sessionName || session.name,
          date: session.date || new Date().toISOString().split("T")[0],
          sets: allSets
        }
      });
      if (res && res.aiFeedback && !res.aiFeedback.error) {
        setAiFeedback(res.aiFeedback);
      } else {
        setAiFeedback(AI_FEEDBACK_MOCK);
      }
    } catch (err) {
      console.warn("Failed to fetch AI feedback from backend, using mock.", err);
      setAiFeedback(AI_FEEDBACK_MOCK);
    } finally {
      setAiState("done");
    }
  };

  const addSet = (exId) => {
    const newId = `s_new_${nextIdRef.current++}`;
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId) return ex;
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet = {
        id: newId,
        type: "work",
        weight: lastSet?.weight || 0,
        reps: 0,
        rir: null,
        aiTarget: null,
        completed: false,
      };
      return { ...ex, sets: [...ex.sets, newSet] };
    }));
    setEntries(prev => ({
      ...prev,
      [newId]: { type: "work", weight: 0, reps: 0, rir: 2, completed: false },
    }));
  };

  const removeSet = (exId) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId || ex.sets.length <= 1) return ex;
      const removed = ex.sets[ex.sets.length - 1];
      setEntries(prev2 => {
        const copy = { ...prev2 };
        delete copy[removed.id];
        return copy;
      });
      return { ...ex, sets: ex.sets.slice(0, -1) };
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <header className={`sticky top-0 z-20 backdrop-blur-md border-b border-zinc-800/60 px-6 py-3 flex-shrink-0 ${readOnly ? "bg-amber-950/20" : "bg-[#0e0e0e]/95"}`}>
        <div className="max-w-4xl mx-auto flex items-center gap-6 justify-between">
          <div>
            {readOnly && (
              <div className="flex items-center gap-1.5 mb-1">
                <Lock size={11} className="text-amber-400" />
                <span className="text-amber-400 text-xs font-bold">MODO LEITURA — Sessão Histórica</span>
              </div>
            )}
            <h2 className="text-white font-black text-base">{session.sessionName || session.name}</h2>
            <p className="text-zinc-600 text-xs">{session.date}</p>
          </div>

          {!readOnly && (
            <div className="text-center">
              <p className="text-emerald-400 font-mono text-2xl font-black leading-none">{fmtTime(elapsed)}</p>
              <p className="text-zinc-600 text-[10px] mt-0.5">tempo</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-white font-black text-lg leading-none">
                {completedSets}<span className="text-zinc-600 font-normal text-sm">/{totalSets}</span>
              </p>
              <p className="text-zinc-600 text-[10px] mt-0.5">séries</p>
            </div>
            <div className="text-center">
              <p className="text-emerald-400 font-black text-lg leading-none">
                {workSetsCompleted}<span className="text-zinc-600 font-normal text-sm">/{workSetsTotal}</span>
              </p>
              <p className="text-zinc-600 text-[10px] mt-0.5">work sets</p>
            </div>
            <div className="w-28">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }} />
              </div>
              <p className="text-zinc-600 text-[10px] mt-1 text-right">{progress}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!readOnly && (
              <>
                <div className="flex items-center gap-0 bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
                  <button onClick={() => setRirMode(true)}
                    className={`px-3 py-1.5 text-xs font-bold transition-all ${
                      rirMode ? "bg-emerald-500 text-black" : "text-zinc-500 hover:text-zinc-300"
                    }`}>RIR</button>
                  <button onClick={() => setRirMode(false)}
                    className={`px-3 py-1.5 text-xs font-bold transition-all ${
                      !rirMode ? "bg-emerald-500 text-black" : "text-zinc-500 hover:text-zinc-300"
                    }`}>RPE</button>
                </div>
                <Btn variant="primary" size="sm" onClick={handleFinish}>
                  <Brain size={13} /> Finalizar {!allDone && `(${completedSets}/${totalSets})`}
                </Btn>
              </>
            )}
            {readOnly && (
              <Btn variant="ghost" size="sm" onClick={() => setView("calendar")}>
                <ChevronLeft size={13} /> Voltar
              </Btn>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {exercises.map((ex, exIdx) => {
            const exSets     = ex.sets.map(s => entries[s.id]).filter(Boolean);
            const exCompleted= exSets.filter(e => e.completed).length;
            const exDone     = exCompleted === exSets.length;
            const isOpen     = openEx === ex.id;

            return (
              <Card key={ex.id} className={exDone ? "border-emerald-800/50" : ""}>
                <button onClick={() => setOpenEx(isOpen ? null : ex.id)}
                  className="w-full flex items-center gap-3 p-4 text-left rounded-t-2xl hover:bg-zinc-800/20 transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border transition-colors ${
                    exDone ? "bg-emerald-500 border-emerald-400" : "bg-zinc-800 border-zinc-700"
                  }`}>
                    {exDone
                      ? <Check size={14} className="text-black" strokeWidth={3} />
                      : <span className="text-zinc-400 text-xs font-black">{exIdx + 1}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${exDone ? "text-emerald-300" : "text-white"}`}>{ex.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="default">{ex.muscle || ex.muscles?.[0]}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-zinc-600 text-xs">{exCompleted}/{exSets.length}</span>
                    {isOpen ? <ChevronUp size={13} className="text-zinc-600" /> : <ChevronDown size={13} className="text-zinc-600" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4">
                    {ex.tip && (
                      <div className="flex items-start gap-2 bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-3 py-2.5 mb-4">
                        <Info size={11} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <p className="text-zinc-400 text-xs leading-relaxed">{ex.tip}</p>
                      </div>
                    )}

                    <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                      <div className="min-w-[500px]">
                        <div className="grid items-center gap-2 px-1 mb-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest"
                      style={{ gridTemplateColumns: "80px 100px 1fr 1fr 1fr 1fr 32px" }}>
                      <span>Tipo</span>
                      <span>Meta IA</span>
                      <span className="text-center">Peso (kg)</span>
                      <span className="text-center">Reps</span>
                      <span className="text-center">{rirMode ? "RIR" : "RPE"}</span>
                      <span className="text-center">Anterior</span>
                      <span />
                    </div>

                    {ex.sets.map(s => {
                      const entry = entries[s.id];
                      if (!entry) return null;
                      const done   = entry.completed;
                      const isWork = entry.type === "work";
                      const typeInfo = SET_TYPE_MAP[entry.type];

                      return (
                        <div key={s.id}
                          className={`grid items-center gap-2 py-2.5 px-1 rounded-xl mb-0.5 transition-colors ${
                            done ? "bg-emerald-900/10" : "hover:bg-zinc-800/20"
                          }`}
                          style={{ gridTemplateColumns: "80px 100px 1fr 1fr 1fr 1fr 32px" }}>

                          <select value={entry.type}
                            disabled={readOnly}
                            onChange={e => upd(s.id, "type", e.target.value)}
                            className={`text-xs font-bold rounded-lg border px-1.5 py-1.5 focus:outline-none focus:border-emerald-500/50 transition-colors bg-transparent cursor-pointer ${
                              typeInfo ? `${typeInfo.color} ${typeInfo.border}` : "text-zinc-400 border-zinc-700"
                            } ${readOnly ? "opacity-60 cursor-default" : ""}`}>
                            {SET_TYPES.map(t => (
                              <option key={t.value} value={t.value} className="bg-zinc-900 text-white">{t.label}</option>
                            ))}
                          </select>

                          <div className="min-w-0">
                            {isWork && s.aiTarget ? (
                              <div className="flex items-center gap-1 bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-2 py-1">
                                <Brain size={9} className="text-emerald-400 flex-shrink-0" />
                                <span className="text-emerald-300 text-[10px] font-mono truncate">
                                  {s.aiTarget.weight}×{s.aiTarget.reps} RIR{s.aiTarget.rir}
                                </span>
                              </div>
                            ) : (
                              <span className="text-zinc-700 text-[10px] pl-2">—</span>
                            )}
                          </div>

                          <div className="flex justify-center">
                            <NumInput value={entry.weight} step={2.5} min={0}
                              disabled={readOnly || done}
                              highlight={isWork && !done}
                              onChange={v => upd(s.id, "weight", v)} />
                          </div>

                          <div className="flex justify-center">
                            <NumInput value={entry.reps} step={1} min={0}
                              disabled={readOnly || done}
                              highlight={isWork && !done}
                              onChange={v => upd(s.id, "reps", v)} />
                          </div>

                          <div className="flex justify-center">
                            {isWork ? (
                              <NumInput
                                value={rirMode ? (entry.rir ?? 2) : (10 - (entry.rir ?? 2))}
                                step={1} min={0} max={10}
                                disabled={readOnly || done}
                                onChange={v => upd(s.id, "rir", rirMode ? v : 10 - v)} />
                            ) : (
                              <span className="text-zinc-700 text-xs">—</span>
                            )}
                          </div>

                          <div className="text-center">
                            <p className="text-zinc-700 text-[10px] font-mono">
                              {s.weight}×{s.reps > 0 ? s.reps : "?"}
                            </p>
                          </div>

                          <div className="flex justify-center">
                            <button disabled={readOnly}
                              onClick={() => upd(s.id, "completed", !done)}
                              className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                                readOnly ? "opacity-40 cursor-default" : "cursor-pointer"
                              } ${done ? "bg-emerald-500 border-emerald-400" : "border-zinc-600 hover:border-emerald-400"}`}>
                              {done && <Check size={12} className="text-black" strokeWidth={3} />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                      </div>
                    </div>

                    {!readOnly && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800/40">
                        <button onClick={() => addSet(ex.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all">
                          <Plus size={12} /> Adicionar Série
                        </button>
                        {ex.sets.length > 1 && (
                          <button onClick={() => removeSet(ex.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 hover:border-red-500/50 transition-all">
                            <Minus size={12} /> Remover Última
                          </button>
                        )}
                        <span className="text-zinc-700 text-xs ml-auto">{ex.sets.length} série(s)</span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          {!readOnly && (
            <div className="py-8 text-center">
              <p className="text-zinc-600 text-sm mb-4">
                {allDone
                  ? "✅ Todas as séries concluídas! Clique para gerar a avaliação da IA."
                  : `${completedSets} de ${totalSets} séries concluídas. Você pode finalizar a qualquer momento.`}
              </p>
              <Btn variant="primary" size="lg" onClick={handleFinish} className="justify-center">
                <Brain size={16} /> Finalizar Treino e Avaliar com IA
              </Btn>
              {!allDone && (
                <p className="text-zinc-700 text-xs mt-3">
                  <AlertTriangle size={10} className="inline mr-1" />
                  Séries incompletas serão salvas como "não realizadas"
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal open={showAI} onClose={() => setShowAI(false)} size="lg"
        title={aiState === "done" ? "Avaliação Inteligente do Treino" : undefined}>

        {aiState === "loading" && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Brain size={36} className="text-emerald-400" />
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <Spinner size={20} />
              <p className="text-white font-bold">Processando dados do treino...</p>
            </div>
            <p className="text-zinc-500 text-sm mb-10 max-w-sm mx-auto">
              O modelo analisa apenas as <strong className="text-emerald-400">Work Sets</strong> para calcular volume, progressão e gerar recomendações.
            </p>
            <div className="space-y-2.5 max-w-xs mx-auto text-left">
              {[
                "Filtrando work sets da sessão…",
                "Calculando volume efetivo e RIR médio…",
                "Comparando com histórico de 12 semanas…",
                "Gerando progressões para próxima sessão…",
              ].map((msg, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                  <span className="text-zinc-500 text-xs">{msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {aiState === "done" && (
          <div className="p-6 space-y-5">
            <div className="flex items-start gap-5">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#27272a" strokeWidth="10" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(aiFeedback.sessionScore / 100) * 238.7} 238.7`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white leading-none">{aiFeedback.sessionScore}</span>
                  <span className="text-zinc-500 text-[10px]">/100</span>
                </div>
              </div>
              <div className="flex-1">
                <Badge variant="emerald" className="mb-2">{aiFeedback.sessionLabel}</Badge>
                <div className="flex gap-4 mb-3 flex-wrap">
                  <div><span className="text-zinc-500 text-xs">Work Sets: </span><span className="text-white text-xs font-bold">{aiFeedback.workSetsAnalyzed}</span></div>
                  <div><span className="text-zinc-500 text-xs">Volume: </span><span className="text-white text-xs font-bold">{((aiFeedback.totalVolume_kg||0)/1000).toFixed(1)} t</span></div>
                  <div><span className="text-zinc-500 text-xs">RIR médio: </span><span className="text-emerald-400 text-xs font-bold">{aiFeedback.avgRIR}</span></div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{aiFeedback.summary}</p>
              </div>
            </div>

            <div>
              <p className="text-zinc-600 text-xs font-black uppercase tracking-widest mb-3">Análise por Exercício</p>
              <div className="space-y-2">
                {aiFeedback.insights?.map((ins, i) => {
                  const styles = {
                    positive: { border: "border-l-emerald-500", icon: "✅", badge: "emerald" },
                    warning:  { border: "border-l-amber-500",   icon: "⚠️",  badge: "amber"   },
                    info:     { border: "border-l-blue-500",    icon: "💡",  badge: "blue"    },
                  }[ins.type] || { border: "border-l-zinc-600", icon: "•", badge: "default" };

                  return (
                    <Card key={i} className={`p-4 border-l-4 ${styles.border}`}>
                      <div className="flex gap-3">
                        <span className="text-lg flex-shrink-0 leading-tight mt-0.5">{styles.icon}</span>
                        <div>
                          <p className="text-white font-semibold text-sm mb-1">{ins.title}</p>
                          <p className="text-zinc-400 text-sm leading-relaxed">{ins.body}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {aiFeedback.nextSession && (
              <div>
                <p className="text-zinc-600 text-xs font-black uppercase tracking-widest mb-3">Próxima Sessão</p>
                <Card className="overflow-hidden">
                  <div className="px-5 py-3 bg-zinc-800/50 border-b border-zinc-800 flex items-center gap-2">
                    <Zap size={13} className="text-emerald-400" />
                    <span className="text-white text-sm font-bold">{aiFeedback.nextSession.date}</span>
                    <Badge variant="emerald" className="ml-auto">Gerado pela IA</Badge>
                  </div>
                  <div className="divide-y divide-zinc-800/60">
                    {aiFeedback.nextSession.recommendations?.map((rec, i) => (
                      <div key={i} className="px-5 py-3.5 flex items-center gap-4 hover:bg-zinc-800/20 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{rec.exercise}</p>
                          <p className="text-zinc-500 text-xs">{rec.target} · {rec.rir}</p>
                        </div>
                        <Badge variant={rec.type === "increase" ? "emerald" : rec.type === "decrease" ? "amber" : "default"}>
                          {rec.change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            <div className="flex gap-3 pt-2 flex-wrap">
              <Btn variant="primary" onClick={() => { setShowAI(false); setView("dashboard"); }}>
                <Home size={13} /> Voltar ao Dashboard
              </Btn>
              <Btn variant="secondary" onClick={() => { setShowAI(false); setView("reports"); }}>
                <BarChart3 size={13} /> Ver Relatórios
              </Btn>
              <Btn variant="ghost" onClick={() => setShowAI(false)}>Fechar</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
