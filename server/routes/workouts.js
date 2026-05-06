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
    
    Retorne uma avaliação no formato JSON com:
    - sessionScore (0-100)
    - sessionLabel (ex: "Ótimo", "Volume excessivo", "RIR muito alto")
    - workSetsAnalyzed (int)
    - totalVolume_kg (int)
    - avgRIR (float)
    - summary (string curta)
    - insights (array de objetos com { type: "positive"|"warning"|"info", title, body })
    - nextSession (objeto com date="Próxima semana", recommendations: array com { exercise, target, rir, type: "increase"|"decrease"|"maintain", change })
    
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

    let aiFeedback;
    try {
      aiFeedback = JSON.parse(aiResultText);
    } catch (e) {
      console.error("Erro ao parsear JSON do Gemini. Texto recebido:", aiResultText);
      aiFeedback = { error: "Erro ao estruturar resposta da IA.", raw: aiResultText };
    }

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

    const result = await pool.query(
      `SELECT id, session_name, date, completed 
       FROM sessions 
       WHERE user_id = $1 
       AND EXTRACT(MONTH FROM date) = $2 
       AND EXTRACT(YEAR FROM date) = $3
       ORDER BY date ASC`,
      [req.user.id, targetMonth, targetYear]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados do calendário' });
  }
});

export default router;
