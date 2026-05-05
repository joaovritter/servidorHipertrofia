// =============================================================================
//  AI SERVICE — Integração com o Google Gemini Flash (via backend proxy)
//  O frontend JAMAIS deve expor a API Key do Gemini. Todas as chamadas
//  vão para o nosso backend, que constrói o prompt, autentica no Google,
//  e retorna o JSON processado.
// =============================================================================

import api from "./api.js";

/**
 * Envia uma sessão recém-concluída para avaliação pela IA.
 * A IA irá calcular o score, analisar os work sets, gerar insights
 * e recomendar cargas/volumes para a próxima sessão.
 * 
 * @param {string} sessionId — ID da sessão recém finalizada
 * @returns {Promise<object>} — Objeto com o feedback estruturado da IA
 */
export async function evaluateSession(sessionId) {
  // Chamada ao nosso backend, que proxy-a para a API Gemini Flash
  return api(`/ai/evaluate-session/${sessionId}`, {
    method: "POST"
  });
}

/**
 * Pede à IA para gerar uma nova divisão semanal baseada no perfil
 * e nos objetivos (goal, experience) do usuário.
 * 
 * @param {object} userProfile — Opcional. Perfil base.
 * @returns {Promise<object>} — Divisão semanal recomendada
 */
export async function suggestDivision(userProfile) {
  return api("/ai/suggest-division", {
    method: "POST",
    body: userProfile
  });
}
