import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Play, Calendar } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Btn from "../components/ui/Btn.jsx";
import Badge from "../components/ui/Badge.jsx";
import WorkoutView from "./WorkoutView.jsx";

// TODO: Pegar CALENDAR_SESSIONS do backend
import { TODAY_SESSION } from "../data/constants.js"; // Simulando

const CALENDAR_SESSIONS = {
  "2025-05-05": {
    name: "Peito, Ombro & Tríceps", type: "strength", done: true,
    duration: 68, workSets: 13, totalVolume_kg: 6840,
    exercises: [], // Simplificado para mock
  },
  "2025-05-06": { name: "Costas & Bíceps",        type: "strength", done: true,  duration: 72, workSets: 12, totalVolume_kg: 7200 },
  "2025-05-07": { name: "Pernas",                  type: "strength", done: true,  duration: 80, workSets: 15, totalVolume_kg: 12800 },
  "2025-05-09": { name: "Peito & Tríceps",         type: "strength", done: true,  duration: 70, workSets: 13, totalVolume_kg: 7020 },
  "2025-05-10": { name: "Costas, Ombro & Bíceps",  type: "strength", done: true,  duration: 66, workSets: 12, totalVolume_kg: 7340 },
  "2025-05-12": { name: "Peito, Ombro & Tríceps",  type: "strength", done: true,  duration: 70, workSets: 14, totalVolume_kg: 7420 },
  "2025-05-13": { name: "Costas & Bíceps",         type: "strength", done: true,  duration: 66, workSets: 12, totalVolume_kg: 7340 },
  "2025-05-14": { name: "Pernas",                  type: "strength", done: true,  duration: 82, workSets: 15, totalVolume_kg: 13100 },
  "2025-05-16": { name: "Peito & Tríceps",         type: "strength", done: true,  duration: 68, workSets: 13, totalVolume_kg: 6950 },
  "2025-05-17": { name: "Costas, Ombro & Bíceps",  type: "strength", done: true,  duration: 72, workSets: 14, totalVolume_kg: 7600 },
  "2025-05-19": { name: "Peito, Ombro & Tríceps",  type: "strength", done: false, planned: true },
  "2025-05-20": { name: "Costas & Bíceps",         type: "strength", done: false, planned: true },
  "2025-05-21": { name: "Pernas",                  type: "strength", done: false, planned: true },
  "2025-05-23": { name: "Peito & Tríceps",         type: "strength", done: false, planned: true },
  "2025-05-24": { name: "Costas, Ombro & Bíceps",  type: "strength", done: false, planned: true },
};


export default function CalendarView({ setView: parentSetView }) {
  const [selectedDay,     setSelectedDay]     = useState(null);
  const [viewingSession,  setViewingSession]  = useState(null);
  const [isReadOnly,      setIsReadOnly]      = useState(false);

  const YEAR = 2025, MONTH = 4; // maio (0-indexed)
  const TODAY_D = 19;
  const firstOffset = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();

  const DAY_NAMES = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const DAY_FULL  = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];

  const getKey  = d => `${YEAR}-${String(MONTH+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const getInfo = d => CALENDAR_SESSIONS[getKey(d)];

  const handleDayClick = (d) => {
    const info = getInfo(d);
    setSelectedDay(d);
    // TODO: Em produção pegar o treino real feito no dia da API e passar para viewingSession
    if (info?.done /* && info?.exercises */) {
      setViewingSession(info);
      // setIsReadOnly(true); // Descomentar ao ligar na API
    }
  };

  if (isReadOnly && viewingSession) {
    const sessionForView = {
      divisionDay: 1,
      sessionName: viewingSession.name,
      date: getKey(selectedDay),
      exercises: viewingSession.exercises,
    };
    return (
      <div className="flex flex-col h-full">
        <WorkoutView
          readOnly={true}
          sessionData={sessionForView}
          setView={(v) => {
            setIsReadOnly(false);
            setViewingSession(null);
            if (v !== "calendar") parentSetView(v);
          }} />
      </div>
    );
  }

  const sel = selectedDay ? getInfo(selectedDay) : null;
  const selDow = selectedDay ? new Date(YEAR, MONTH, selectedDay).getDay() : null;

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white">Calendário de Treinos</h1>
          <p className="text-zinc-500 text-sm mt-1">Clique em um dia concluído para revisar a sessão completa</p>
        </div>

        <div className="flex gap-5 mb-5 flex-wrap">
          {[
            { c: "bg-emerald-400", l: "Treino concluído" },
            { c: "bg-zinc-600",    l: "Planejado" },
            { c: "bg-emerald-500", l: "Hoje" },
          ].map(x => (
            <div key={x.l} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${x.c}`} />
              <span className="text-zinc-500 text-xs">{x.l}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-[1fr_280px]">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-sm">Maio 2025</h3>
              <div className="flex gap-2">
                <Btn variant="ghost" size="xs"><ChevronLeft size={12} /></Btn>
                <Btn variant="ghost" size="xs"><ChevronRight size={12} /></Btn>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-3">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-[10px] font-black text-zinc-700 uppercase tracking-widest py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array(firstOffset).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const d    = i + 1;
                const info = getInfo(d);
                const isTd = d === TODAY_D;
                const isSel= d === selectedDay;
                const isDone   = info?.done;
                const isPlanned= info?.planned;
                const isClickable = isDone;

                return (
                  <button key={d}
                    onClick={() => handleDayClick(d)}
                    className={`relative flex flex-col items-center justify-center min-h-[54px] rounded-xl border text-sm font-bold transition-all ${
                      isSel ? "ring-2 ring-emerald-400 ring-offset-1 ring-offset-[#0e0e0e]" : ""
                    } ${
                      isTd && !isSel ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" :
                      isDone ? "border-emerald-800/50 bg-emerald-500/8 text-emerald-300 hover:bg-emerald-500/15 cursor-pointer" :
                      isPlanned ? "border-zinc-700/50 bg-zinc-800/30 text-zinc-500 cursor-default" :
                      "border-transparent text-zinc-700 hover:bg-zinc-800/30 cursor-default"
                    }`}>
                    <span className="leading-none">{d}</span>
                    {info && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isTd ? "bg-emerald-400" :
                        isDone ? "bg-emerald-400" :
                        "bg-zinc-600"
                      }`} />
                    )}
                    {isClickable && (
                      <Eye size={8} className="absolute bottom-1 right-1.5 text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="space-y-3">
            <Card className="p-4">
              {selectedDay ? (
                <>
                  <p className="text-zinc-600 text-xs mb-0.5">{DAY_FULL[selDow]}</p>
                  <h3 className="text-white font-black text-lg mb-4">{selectedDay} de Maio</h3>

                  {sel ? (
                    <>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <Badge variant={sel.done ? "emerald" : "default"}>
                          {sel.done ? "✓ Concluído" : "Planejado"}
                        </Badge>
                        <Badge variant="blue">Musculação</Badge>
                      </div>
                      <p className="text-white font-bold mb-4">{sel.name}</p>

                      {sel.done && sel.workSets && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[
                            { l: "Work Sets",  v: sel.workSets },
                            { l: "Duração",    v: `${sel.duration} min` },
                            { l: "Volume",     v: `${(sel.totalVolume_kg/1000).toFixed(1)} t` },
                            { l: "Semana",     v: "S12 Meso" },
                          ].map(s => (
                            <div key={s.l} className="bg-zinc-800 rounded-xl p-2.5 text-center">
                              <p className="text-zinc-500 text-[10px]">{s.l}</p>
                              <p className="text-white font-bold text-sm mt-0.5">{s.v}</p>
                            </div>
                          ))}
                        </div>
                      )}


                      {sel.done && (
                        <Btn variant="secondary" size="sm" className="w-full justify-center"
                          onClick={() => { setViewingSession(sel); setIsReadOnly(true); }}>
                          <Eye size={12} /> Revisar Sessão Completa
                        </Btn>
                      )}
                      {sel.planned && (
                        <Btn variant="primary" size="sm" className="w-full justify-center"
                          onClick={() => parentSetView("workout")}>
                          <Play size={12} fill="currentColor" /> Iniciar Treino
                        </Btn>
                      )}
                    </>
                  ) : (
                    <p className="text-zinc-600 text-sm">Nenhum treino neste dia.</p>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Calendar size={28} className="text-zinc-800 mx-auto mb-3" />
                  <p className="text-zinc-600 text-sm">Selecione um dia</p>
                  <p className="text-zinc-700 text-xs mt-1">Dias com 👁 têm sessão revisável</p>
                </div>
              )}
            </Card>

            <Card className="p-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Resumo · Maio 2025</h4>
              {[
                { l: "Treinos Concluídos", v: 10, c: "bg-emerald-400" },
                { l: "Descanso Ativo",     v:  4, c: "bg-zinc-600"    },
                { l: "Planejados",         v:  5, c: "bg-zinc-700"    },
              ].map(s => (
                <div key={s.l} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${s.c}`} />
                    <span className="text-zinc-400 text-xs">{s.l}</span>
                  </div>
                  <span className="text-white font-black text-sm">{s.v}</span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-zinc-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Taxa de adesão</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
