/**
 * Script de população (seed) do banco de dados.
 * Responsável por resetar/criar a estrutura das tabelas e inserir dados 
 * iniciais de teste (usuários, exercícios e treinos) para desenvolvimento.
 */
import pg from 'pg';

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/hypertrack',
});

async function runSeed() {
  console.log('🔄 Iniciando Seed do Banco de Dados HyperTrack...');

  try {
    // 1. Cria as tabelas
    console.log('📄 Executando schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await pool.query(schemaSql);
    console.log('✅ Tabelas criadas com sucesso!');

    // 2. Inserir Mock User
    console.log('👤 Inserindo usuário de teste...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('mypassword', salt);
    const userRes = await pool.query(
      `INSERT INTO users (name, email, password, weight, height, age, goal, experience) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      ['Alex Costa', 'alex@hypertrack.app', hashedPassword, 82.5, 178, 28, 'Hipertrofia Máxima', 'Avançado (5+ anos)']
    );
    const userId = userRes.rows[0].id;
    console.log(`✅ Usuário criado (ID: ${userId}) - Email: alex@hypertrack.app / Senha: mypassword`);

    // 3. Inserir Grupos Musculares
    console.log('🍖 Inserindo grupos musculares...');
    const muscleGroups = [
      ['chest', 'Peito', 'Músculos peitorais maiores e menores.'],
      ['back', 'Costas', 'Dorsais, romboides e trapézio.'],
      ['shoulders', 'Ombros', 'Deltoides anterior, lateral e posterior.'],
      ['biceps', 'Bíceps', 'Bíceps braquial e braquial.'],
      ['triceps', 'Tríceps', 'Tríceps braquial (três cabeças).'],
      ['legs', 'Pernas', 'Quadríceps, posteriores, glúteos e panturrilhas.'],
      ['abs', 'Abdômen', 'Reto abdominal e oblíquos.'],
    ];

    for (const mg of muscleGroups) {
      await pool.query(
        `INSERT INTO muscle_groups (id, name, description) VALUES ($1, $2, $3)`,
        mg
      );
    }
    console.log('✅ Grupos musculares inseridos!');

    // 4. Inserir Banco de Exercícios
    console.log('🏋️ Inserindo exercícios...');
    const exercises = [
      ['ex_bp', 'Supino Reto com Barra', 'chest', 'Barra', 'compound', 'Contraia as escápulas e mantenha os pés firmes no chão.'],
      ['ex_ibp', 'Supino Inclinado com Halteres', 'chest', 'Halteres', 'compound', 'Ângulo do banco entre 30 e 45 graus.'],
      ['ex_fly', 'Crucifixo na Polia Média', 'chest', 'Polia', 'isolation', 'Foque no alongamento máximo do peitoral.'],
      ['ex_tpu', 'Tríceps Pulldown na Polia', 'triceps', 'Polia', 'isolation', 'Mantenha os cotovelos fixos ao lado do corpo.'],
      ['ex_fra', 'Elevação Frontal com Halteres', 'shoulders', 'Halteres', 'isolation', 'Evite usar impulso do tronco.'],
      ['ex_row', 'Remada Curvada com Barra', 'back', 'Barra', 'compound', 'Puxe a barra em direção ao umbigo.'],
      ['ex_pd', 'Puxada Frontal Alta (Pulldown)', 'back', 'Polia', 'compound', 'Incline levemente o tronco para trás.'],
      ['ex_cr', 'Remada Baixa Sentado', 'back', 'Máquina', 'compound', 'Aperte as escápulas no final do movimento.'],
      ['ex_bcb', 'Rosca Direta com Barra W', 'biceps', 'Barra', 'isolation', 'Não balance o tronco.'],
      ['ex_bch', 'Rosca Martelo com Halteres', 'biceps', 'Halteres', 'isolation', 'Mantenha o punho neutro.'],
      ['ex_sq', 'Agachamento Livre', 'legs', 'Barra', 'compound', 'Quebre a paralela mantendo a coluna neutra.'],
      ['ex_lp', 'Leg Press 45', 'legs', 'Máquina', 'compound', 'Não estenda totalmente os joelhos no final da concêntrica.'],
      ['ex_rdl', 'Stiff / Romanian Deadlift', 'legs', 'Barra', 'compound', 'Mantenha as pernas semi-flexionadas e desça alongando os posteriores.'],
      ['ex_leg', 'Cadeira Extensora', 'legs', 'Máquina', 'isolation', 'Contraia o quadríceps no topo do movimento por 1 segundo.'],
      ['ex_curl', 'Cadeira Flexora', 'legs', 'Máquina', 'isolation', 'Controle a fase excêntrica.'],
    ];

    for (const ex of exercises) {
      await pool.query(
        `INSERT INTO exercises (id, name, muscle_group_id, equipment, type, tip) VALUES ($1, $2, $3, $4, $5, $6)`,
        ex
      );
    }
    console.log('✅ Exercícios inseridos!');

    // 4. Inserir Divisão do Usuário e Exercícios Selecionados
    console.log('📅 Configurando divisão de treino...');
    const divisions = [
      { day: 1, name: 'Peito, Ombro & Tríceps', muscles: ['chest', 'shoulders', 'triceps'], exercises: ['ex_bp', 'ex_ibp', 'ex_fly', 'ex_tpu', 'ex_fra'] },
      { day: 2, name: 'Costas & Bíceps', muscles: ['back', 'biceps'], exercises: ['ex_row', 'ex_pd', 'ex_cr', 'ex_bcb', 'ex_bch'] },
      { day: 3, name: 'Pernas', muscles: ['legs'], exercises: ['ex_sq', 'ex_lp', 'ex_rdl', 'ex_leg', 'ex_curl'] },
      { day: 5, name: 'Peito & Tríceps', muscles: ['chest', 'triceps'], exercises: ['ex_bp', 'ex_ibp', 'ex_fly', 'ex_tpu'] },
      { day: 6, name: 'Costas, Ombro & Bíceps', muscles: ['back', 'shoulders', 'biceps'], exercises: ['ex_pd', 'ex_row', 'ex_fra', 'ex_bcb'] },
    ];

    for (const div of divisions) {
      await pool.query(
        `INSERT INTO user_divisions (user_id, day_of_week, name, muscles) VALUES ($1, $2, $3, $4)`,
        [userId, div.day, div.name, div.muscles]
      );
      
      let order = 1;
      for (const exId of div.exercises) {
        await pool.query(
          `INSERT INTO user_exercises (user_id, day_of_week, exercise_id, order_idx) VALUES ($1, $2, $3, $4)`,
          [userId, div.day, exId, order++]
        );
      }
    }
    console.log('✅ Divisão e exercícios salvos!');

    // 5. Inserir Histórico de Sessões Recentes
    console.log('📊 Criando sessões históricas...');
    const today = new Date();
    
    // Treino de Peito (Hoje - Pendente)
    await pool.query(
      `INSERT INTO sessions (user_id, session_name, date, completed) VALUES ($1, $2, CURRENT_DATE, false)`,
      [userId, 'Peito, Ombro & Tríceps']
    );

    // Treino de Pernas (Passado - Concluído)
    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - 3);
    const sessionRes = await pool.query(
      `INSERT INTO sessions (user_id, session_name, date, duration_min, completed) VALUES ($1, $2, $3, $4, true) RETURNING id`,
      [userId, 'Pernas', pastDate.toISOString().split('T')[0], 82]
    );
    const pastSessionId = sessionRes.rows[0].id;

    // Sets para o treino de Pernas
    const sets = [
      { ex: 'ex_sq', type: 'warmup', weight: 60, reps: 10, rir: null },
      { ex: 'ex_sq', type: 'work', weight: 120, reps: 8, rir: 2 },
      { ex: 'ex_sq', type: 'work', weight: 120, reps: 7, rir: 1 },
      { ex: 'ex_lp', type: 'work', weight: 240, reps: 12, rir: 2 },
      { ex: 'ex_lp', type: 'work', weight: 240, reps: 10, rir: 1 },
    ];

    for (const s of sets) {
      await pool.query(
        `INSERT INTO sets (session_id, exercise_id, type, weight, reps, rir, completed) VALUES ($1, $2, $3, $4, $5, $6, true)`,
        [pastSessionId, s.ex, s.type, s.weight, s.reps, s.rir]
      );
    }

    console.log('✅ Seed finalizado com sucesso! Seu banco de dados está pronto para usar.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao rodar seed:', error);
    process.exit(1);
  }
}

runSeed();
