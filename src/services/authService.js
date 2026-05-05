// =============================================================================
//  AUTH SERVICE — Autenticação e Registro
//  Comunica com: POST /api/auth/login, POST /api/auth/register
//  O token JWT retornado é armazenado via api.setToken()
// =============================================================================

import api, { setToken, removeToken } from "./api.js";

/**
 * Realiza login e armazena o token JWT.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, token: string}>}
 */
export async function login(email, password) {
  const data = await api("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(data.token);
  return data;
}

/**
 * Registra novo usuário e armazena o token JWT.
 * @param {object} userData — { name, email, password }
 * @returns {Promise<{user: object, token: string}>}
 */
export async function register(userData) {
  const data = await api("/auth/register", {
    method: "POST",
    body: userData,
  });
  setToken(data.token);
  return data;
}

/**
 * Remove o token local (logout). Em produção: também invalida no backend.
 */
export function logout() {
  removeToken();
}

/**
 * Obtém o perfil do usuário autenticado.
 * @returns {Promise<object>}
 */
export async function getProfile() {
  return api("/user/profile");
}

/**
 * Atualiza o perfil do usuário.
 * @param {object} profileData — { weight, height, age, goal, experience, injuries }
 * @returns {Promise<object>}
 */
export async function updateProfile(profileData) {
  return api("/user/profile", {
    method: "PUT",
    body: profileData,
  });
}
