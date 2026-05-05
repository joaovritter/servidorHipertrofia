/**
 * Rotas de treinamento.
 * Responsável por fornecer informações sobre a divisão semanal do usuário
 * e detalhar os exercícios previstos para as sessões de treino diárias.
 */
import express from 'express';

import { pool } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Obter divisão semanal
router.get('/division', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_divisions WHERE user_id = $1 ORDER BY day_of_week',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar divisão' });
  }
});

// Obter sessão do dia
router.get('/session', authenticateToken, async (req, res) => {
  try {
    const { offset = 0 } = req.query;
    const date = new Date();
    date.setDate(date.getDate() + parseInt(offset));
    const dayOfWeek = date.getDay();

    const division = await pool.query(
      'SELECT * FROM user_divisions WHERE user_id = $1 AND day_of_week = $2',
      [req.user.id, dayOfWeek]
    );

    if (division.rows.length === 0) {
      return res.json({ restDay: true, message: "Dia de descanso!" });
    }

    const exercises = await pool.query(
      `SELECT e.*, ue.order_idx 
       FROM user_exercises ue 
       JOIN exercises e ON ue.exercise_id = e.id 
       WHERE ue.user_id = $1 AND ue.day_of_week = $2
       ORDER BY ue.order_idx`,
      [req.user.id, dayOfWeek]
    );

    res.json({
      ...division.rows[0],
      exercises: exercises.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar sessão' });
  }
});

export default router;
