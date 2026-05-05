import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginService, register as registerService, logout as logoutService } from "../services/authService.js";
import { hasToken } from "../services/api.js";
import { MOCK_USER } from "../data/constants.js";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // No carregamento inicial, verifica se há token
  useEffect(() => {
    async function checkAuth() {
      if (hasToken()) {
        try {
          // Em um app real, buscaríamos o profile
          // Para evitar criar mais rotas de imediato, manteremos usando mock user para session inicial
          setUser(MOCK_USER);
        } catch (error) {
          console.error("Token inválido ou expirado", error);
          logoutService();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { user } = await loginService(email, password);
      setUser(user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const { user } = await registerService(userData);
      setUser(user);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const completeOnboarding = () => {
    setUser(prev => ({ ...prev, onboarded: true }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, completeOnboarding }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
