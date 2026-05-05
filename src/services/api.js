// =============================================================================
//  API CLIENT — Camada de abstração HTTP com JWT
//  Todas as requisições ao backend passam por aqui.
//  O token JWT é injetado automaticamente via interceptor.
//
//  Em produção: API_BASE aponta para o backend Express.
//  Em dev: pode usar proxy do Vite (vite.config.js → server.proxy)
// =============================================================================

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Recupera o token JWT do localStorage.
 * Em produção: considerar httpOnly cookies para segurança contra XSS.
 */
const getToken = () => localStorage.getItem("hypertrack_token");

/**
 * Armazena o token JWT no localStorage após login.
 */
export const setToken = (token) => localStorage.setItem("hypertrack_token", token);

/**
 * Remove o token JWT (logout).
 */
export const removeToken = () => localStorage.removeItem("hypertrack_token");

/**
 * Verifica se existe um token armazenado.
 */
export const hasToken = () => !!getToken();

/**
 * Cliente HTTP genérico com injeção automática de JWT.
 * Retorna JSON parseado ou lança erro com mensagem do servidor.
 *
 * @param {string} path — Rota relativa (ex: "/auth/login")
 * @param {object} opts — Opções do fetch (method, body, etc.)
 * @returns {Promise<any>} — Resposta JSON do servidor
 */
export async function api(path, opts = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  // Tratamento de erro HTTP
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro de rede" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

export default api;
