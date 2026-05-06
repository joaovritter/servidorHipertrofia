/**
 * Rotas de execução de treinos e integração com IA.
 * Processa a finalização de sessões e utiliza o Google Gemini para gerar
 * feedbacks personalizados e ajustes de carga/intensidade.
 */
import express from 'express';

import { GoogleGenAI } from '@google/genai';
import { pool } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//Retorna tudo que foi feito naquele treino específico
router.get('/session/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // 1. Busca os dados básicos da sessão e o feedback da IA
    const sessionRes = await pool.query(
      'SELECT * FROM sessions WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (sessionRes.rows.length === 0) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }
    // 2. Busca todos os exercícios e séries feitos nessa sessão
    const setsRes = await pool.query(
      `SELECT sl.*, e.name as exercise_name, e.muscle_group_id as muscle_group, e.equipment 
       FROM set_logs sl
       JOIN exercises e ON sl.exercise_id = e.id
       WHERE sl.session_id = $1
       ORDER BY sl.id ASC`,
      [id]
    );
    // Agrupa as séries por exercício para facilitar o front-end
    const exercisesPerformed = setsRes.rows.reduce((acc, set) => {
      if (!acc[set.exercise_id]) {
        acc[set.exercise_id] = {
          name: set.exercise_name,
          muscle_group: set.muscle_group,
          equipment: set.equipment,
          sets: []
        };
      }
      acc[set.exercise_id].sets.push(set);
      return acc;
    }, {});
    res.json({
      ...sessionRes.rows[0],
      details: Object.values(exercisesPerformed)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar detalhes da sessão' });
  }
});


// Finaliza treino e avalia com Gemini
router.post('/session/:id/finish', authenticateToken, async (req, res) => {
  try {
    const { sets, sessionName, date } = req.body;
    const workSets = sets.filter(s => s.type === 'work' && s.completed);

    const prompt = `
    Aja como um treinador especialista em hipertrofia.
    Analise os seguintes "Work Sets" de uma sessão de treino de musculação:
    Sessão: ${sessionName} (${date})
    Séries:
    ${JSON.stringify(workSets, null, 2)}
    
    Retorne uma avaliação no formato JSON seguindo estas regras ESTRITAS:
    - sessionScore (0-100)
    - sessionLabel (ex: "Ótimo", "Volume excessivo", "RIR muito alto")
    - workSetsAnalyzed (int)
    - totalVolume_kg (int)
    - avgRIR (float)
    - summary (string curta)
    - insights (array de objetos com { type: "positive"|"warning"|"info", title, body })
    - nextSession: objeto com date="Próxima semana" e recommendations: array de objetos { 
        exercise: (NOME EXATO DO EXERCÍCIO), 
        target: (STRING NO FORMATO EXATO "XX.Xkg x YY reps"), 
        rir: (INT), 
        type: "increase"|"decrease"|"maintain", 
        change: (DESCRIÇÃO CURTA)
      }
    
    IMPORTANTE: No campo 'target', o peso deve ter uma casa decimal e terminar em 'kg' (ex: 52.5kg). As repetições devem vir após o 'x'.
    Retorne apenas JSON puro, sem markdown tags ou \`\`\`json.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: "application/json", // Força a IA a devolver apenas JSON válido
      }
    });

    let aiResultText = response.text;

    const aiFeedback = JSON.parse(aiResultText);

    // --- NOVO: PERSISTÊNCIA NO BANCO DE DADOS ---

    // 1. Criar uma NOVA sessão concluída no histórico
    const sessionResult = await pool.query(
      `INSERT INTO sessions (user_id, session_name, date, completed, ai_feedback)
       VALUES ($1, $2, $3, true, $4)
       RETURNING id`,
      [req.user.id, sessionName, date || new Date(), aiFeedback]
    );

    const newSessionId = sessionResult.rows[0].id;

    // 2. Salvar cada série (set) no log de treinos usando o NOVO ID da sessão
    for (const set of sets) {
      await pool.query(
        `INSERT INTO set_logs (session_id, exercise_id, weight, reps, rir, type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newSessionId, set.exercise_id, set.weight, set.reps, set.rir, set.type || 'work']
      );
    }

    console.log(`✅ Treino salvo com sucesso! Nova Sessão ID: ${newSessionId}`);
    console.log('🤖 Feedback da IA gerado com sucesso:');
    console.log(JSON.stringify(aiFeedback, null, 2));

    res.json({ success: true, aiFeedback });
  } catch (error) {
    console.error("Erro detalhado no Gemini:", error);
    res.status(500).json({
      error: 'Erro ao processar feedback da IA',
      details: error.message
    });
  }
});

// Obter histórico para o calendário (mês/ano)
router.get('/calendar', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.query;

    // Se não passar mês/ano, pega o mês atual
    const targetMonth = month || new Date().getMonth() + 1;
    const targetYear = year || new Date().getFullYear();

    console.log(`📅 Buscando histórico para o Usuário: ${req.user.id}`);
    console.log(`📅 Período: ${targetMonth}/${targetYear}`);

    const result = await pool.query(
      `SELECT id, session_name, date, completed 
       FROM sessions 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3
       ORDER BY date DESC`,
      [req.user.id, targetMonth, targetYear]
    );

    console.log(`✅ Treinos encontrados: ${result.rows.length}`);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados do calendário' });
  }
});

export default router;
