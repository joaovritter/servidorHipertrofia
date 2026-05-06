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

// Obter todos os exercícios disponíveis no sistema
router.get('/exercises', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, mg.name as muscle_group_name 
      FROM exercises e 
      JOIN muscle_groups mg ON e.muscle_group_id = mg.id 
      ORDER BY e.name ASC
    `);

    console.log(`✅ Buscados ${result.rows.length} exercícios do banco.`);
    if (result.rows.length > 0) {
      console.log('Exemplo do primeiro exercício:', result.rows[0]);
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar banco de exercícios' });
  }
});

// Obter todos os grupos musculares
router.get('/muscle-groups', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM muscle_groups ORDER BY name ASC');
    console.log('🍖 Grupos Musculares enviados ao Front:', result.rows);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar grupos musculares' });
  }
});

// Configurar/Atualizar divisão de treino e exercícios selecionados
router.post('/setup', authenticateToken, async (req, res) => {
  console.log('📦 Corpo da requisição recebido:', JSON.stringify(req.body, null, 2));
  const client = await pool.connect();
  try {
    const { divisions } = req.body; // Array de { day_of_week, name, muscles, exercises: [id1, id2...] }

    await client.query('BEGIN');

    // 1. Limpa as configurações atuais do usuário
    await client.query('DELETE FROM user_exercises WHERE user_id = $1', [req.user.id]);
    await client.query('DELETE FROM user_divisions WHERE user_id = $1', [req.user.id]);

    // 2. Insere a nova configuração
    for (const div of divisions) {
      // Insere a divisão do dia
      await client.query(
        'INSERT INTO user_divisions (user_id, day_of_week, name, muscles) VALUES ($1, $2, $3, $4)',
        [req.user.id, div.day_of_week, div.name, div.muscles]
      );

      // Insere os exercícios vinculados a esse dia
      if (div.exercises && div.exercises.length > 0) {
        let order = 1;
        for (const exId of div.exercises) {
          await client.query(
            'INSERT INTO user_exercises (user_id, day_of_week, exercise_id, order_idx) VALUES ($1, $2, $3, $4)',
            [req.user.id, div.day_of_week, exId, order++]
          );
        }
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Configuração de treino salva com sucesso!' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar configuração de treino' });
  } finally {
    client.release();
  }
});

export default router;

