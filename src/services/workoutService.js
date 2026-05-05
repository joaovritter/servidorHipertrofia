// =============================================================================
//  WORKOUT SERVICE — Gestão de Treinos e Divisões
//  Comunica com as rotas /api/training e /api/workouts
// =============================================================================

import api from "./api.js";

/**
 * Obtém a divisão semanal do usuário.
 * @returns {Promise<Array>} — Array de 7 dias com grupos e exercícios
 */
export async function getWeeklyDivision() {
  return api("/training/division");
}

/**
 * Salva a configuração da divisão semanal.
 * @param {object} divisionData — Mapa dia -> [muscles]
 * @returns {Promise<object>}
 */
export async function saveWeeklyDivision(divisionData) {
  return api("/training/division", {
    method: "POST",
    body: divisionData,
  });
}

/**
 * Obtém a sessão de treino de hoje (ou de um dia específico).
 * @param {number} dayOffset — Opcional. 0 = hoje.
 * @returns {Promise<object>}
 */
export async function getTodaySession(dayOffset = 0) {
  return api(`/training/session?offset=${dayOffset}`);
}

/**
 * Salva o progresso PARCIAL de uma sessão em andamento.
 * Auto-save para não perder dados se o app fechar.
 * @param {string} sessionId 
 * @param {object} entriesData — Dados das séries
 */
export async function saveSessionProgress(sessionId, entriesData) {
  return api(`/workouts/session/${sessionId}/progress`, {
    method: "PATCH",
    body: entriesData,
  });
}

/**
 * Finaliza a sessão e envia para avaliação da IA.
 * Suporta finalização flexível (partial: true) se nem todas as séries foram feitas.
 * @param {string} sessionId 
 * @param {object} finalData — Dados consolidados do treino
 */
export async function finishSession(sessionId, finalData) {
  return api(`/workouts/session/${sessionId}/finish`, {
    method: "POST",
    body: finalData,
  });
}

/**
 * Obtém o histórico do calendário para um mês específico.
 * @param {number} year 
 * @param {number} month 
 * @returns {Promise<object>}
 */
export async function getCalendarData(year, month) {
  return api(`/workouts/calendar?year=${year}&month=${month}`);
}

/**
 * Obtém dados agregados para os gráficos de volume e 1RM.
 * @param {number} weeks — Número de semanas retroativas
 * @returns {Promise<object>}
 */
export async function getAnalytics(weeks = 12) {
  return api(`/analytics?weeks=${weeks}`);
}
