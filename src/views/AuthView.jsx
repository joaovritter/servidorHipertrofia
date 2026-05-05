import React, { useState } from "react";
import { Dumbbell, Eye, EyeOff, AlertTriangle, ChevronRight } from "lucide-react";
import Btn from "../components/ui/Btn.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthView() {
  const { login } = useAuth();
  const [email, setEmail] = useState("alex@hypertrack.app");
  const [pass,  setPass]  = useState("mypassword");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState("");

  const handleLogin = async () => {
    if (!email || !pass) { setError("Preencha todos os campos."); return; }
    setError("");
    setLoading(true);
    
    try {
      await login(email, pass);
    } catch (err) {
      setError(err.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500 mb-5 shadow-xl shadow-emerald-500/30">
            <Dumbbell size={30} className="text-black" />
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', system-ui" }} className="text-4xl text-white tracking-widest">
            HYPERTRACK
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Autogestão de Treinos para Atletas Avançados</p>
        </div>

        <div className="space-y-3">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              <AlertTriangle size={13} className="text-red-400" />
              <span className="text-red-400 text-xs">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-widest">E-mail</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder-zinc-700" />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-widest">Senha</label>
            <div className="relative">
              <input value={pass} onChange={e => setPass(e.target.value)}
                type={showPass ? "text" : "password"}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20 transition-all" />
              <button onClick={() => setShowPass(!showPass)} type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <Btn variant="primary" size="lg" className="w-full justify-center mt-2" onClick={handleLogin} disabled={loading}>
            {loading ? <><Spinner size={15} /> Autenticando...</> : "Entrar no Sistema"}
          </Btn>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
            <div className="relative flex justify-center"><span className="bg-[#0e0e0e] px-3 text-zinc-700 text-xs">ou</span></div>
          </div>

          <Btn variant="secondary" size="lg" className="w-full justify-center" onClick={handleLogin}>
            Criar conta gratuita <ChevronRight size={14} />
          </Btn>
        </div>

        <p className="text-center text-zinc-800 text-xs mt-10">
          HyperTrack · TCC Sistemas de Informação 2025
        </p>
      </div>
    </div>
  );
}
