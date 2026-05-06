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
// server/routes/training.js

router.get('/session', authenticateToken, async (req, res) => {
  const { offset = 0 } = req.query;
  try {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(offset));
    const dayOfWeek = date.getDay();

    // 1. Busca a divisão do dia
    const division = await pool.query(
      'SELECT * FROM user_divisions WHERE user_id = $1 AND day_of_week = $2',
      [req.user.id, dayOfWeek]
    );

    if (division.rows.length === 0) {
      return res.json({ restDay: true, message: "Dia de descanso!" });
    }

    const sessionName = division.rows[0].name;

    // 2. BUSCA A ÚLTIMA SESSÃO CONCLUÍDA (Histórico) para pegar as metas da IA
    const lastSession = await pool.query(
      `SELECT ai_feedback FROM sessions 
       WHERE user_id = $1 AND session_name = $2 AND completed = true 
       ORDER BY date DESC LIMIT 1`,
      [req.user.id, sessionName]
    );

    // Extrai as recomendações do JSON da IA (se existirem)
    const aiRecommendations = lastSession.rows[0]?.ai_feedback?.nextSession?.recommendations || [];

    // 3. Busca os exercícios da divisão
    const exercises = await pool.query(
      `SELECT e.*, ue.order_idx 
       FROM user_exercises ue 
       JOIN exercises e ON ue.exercise_id = e.id 
       WHERE ue.user_id = $1 AND ue.day_of_week = $2
       ORDER BY ue.order_idx`,
      [req.user.id, dayOfWeek]
    );

    // 4. MAPEIA OS EXERCÍCIOS COM SUAS RESPECTIVAS METAS IA
    const exercisesWithAiGoals = exercises.rows.map(ex => {
      // Tenta encontrar uma recomendação da IA para este exercício específico pelo nome
      const rec = aiRecommendations.find(r => r.exercise.toLowerCase() === ex.name.toLowerCase());

      let aiTarget = null;
      if (rec && rec.target) {
        try {
          // Extrai os valores do texto (Ex: "45.5kg x 12 reps")
          const weightPart = rec.target.split('kg')[0];
          const repsPart = rec.target.split('x ')[1];

          aiTarget = {
            weight: parseFloat(weightPart),
            reps: parseInt(repsPart),
            rir: parseInt(rec.rir) || 2
          };
        } catch (e) {
          console.warn(`Erro ao processar meta IA para ${ex.name}:`, e);
        }
      }

      return {
        ...ex,
        ai_target: aiTarget
      };
    });

    // 5. Retorna o objeto completo para o Front-end
    res.json({
      ...division.rows[0],
      exercises: exercisesWithAiGoals
    });

  } catch (error) {
    console.error('❌ Erro ao buscar sessão:', error);
    res.status(500).json({ error: 'Erro ao buscar sessão de treino' });
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

