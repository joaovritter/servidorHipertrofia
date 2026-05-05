import React from "react";
import { Dumbbell, Calendar, BarChart3, Settings, LogOut, Flame } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Sidebar({ currentView, setView }) {
  const { user, logout } = useAuth();
  
  const MENU = [
    { id: "dashboard", icon: Flame,       label: "Início" },
    { id: "workout",   icon: Dumbbell,    label: "Treino" },
    { id: "calendar",  icon: Calendar,    label: "Calendário" },
    { id: "reports",   icon: BarChart3,   label: "Relatórios" },
    { id: "settings",  icon: Settings,    label: "Ajustes" },
  ];

  return (
    <nav className="w-full md:w-64 bg-[#0e0e0e] border-b md:border-b-0 md:border-r border-zinc-800/60 flex flex-col flex-shrink-0 transition-all z-50 relative">
      
      {/* Cabeçalho / Header (Topo no Mobile, Topo no Desktop) */}
      <div className="h-16 flex items-center justify-between md:justify-start px-4 md:px-6 border-b border-zinc-800/60">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Dumbbell size={16} className="text-black" />
          </div>
          <span className="ml-3 font-black text-lg text-white tracking-tight">HyperTrack</span>
        </div>

        {/* Perfil no Mobile (fica no topo à direita) */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={logout} className="text-zinc-500 hover:text-red-400 transition-colors p-1">
            <LogOut size={16} />
          </button>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
            <span className="text-zinc-400 text-xs font-bold">{user?.initials || "U"}</span>
          </div>
        </div>
      </div>

      {/* Menu Principal */}
      <div className="flex-1 py-2 px-2 md:py-6 md:px-3 overflow-x-auto md:overflow-visible flex flex-row md:flex-col space-x-1 md:space-x-0 md:space-y-2 no-scrollbar">
        {MENU.map(m => {
          const active = currentView === m.id;
          return (
            <button key={m.id} onClick={() => setView(m.id)}
              className={`flex-shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 py-2.5 md:py-2.5 rounded-xl transition-all ${
                active ? "bg-zinc-800/80 text-emerald-400 font-bold" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
              }`}>
              <m.icon size={18} />
              <span className={`text-sm ${active ? 'block' : 'hidden md:block'}`}>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Perfil no Desktop (fica no rodapé da Sidebar) */}
      <div className="hidden md:block p-4 border-t border-zinc-800/60 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
            <span className="text-zinc-400 text-sm font-bold">{user?.initials || "U"}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate">{user?.name || "Usuário"}</p>
            <button onClick={logout} className="text-zinc-500 text-xs hover:text-red-400 transition-colors flex items-center gap-1 mt-0.5">
              <LogOut size={10} /> Sair
            </button>
          </div>
        </div>
      </div>

      {/* Esconde a scrollbar no mobile para o menu horizontal ficar mais bonito */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}
