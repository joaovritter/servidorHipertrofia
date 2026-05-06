/**
 * Script de população (seed) do banco de dados.
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
      await pool.query(`INSERT INTO muscle_groups (id, name, description) VALUES ($1, $2, $3)`, mg);
    }

    // 4. Inserir Banco de Exercícios
    console.log('🏋️ Inserindo exercícios...');
    const exercises = [
      // --- PEITORAL ---
      ['ex_ch_bpb', 'Supino Reto com Barra', 'chest', 'Barra', 'compound', 'Mantenha os pés firmes e as escápulas retraídas.'],
      ['ex_ch_bph', 'Supino Reto com Halteres', 'chest', 'Halteres', 'compound', 'Maior amplitude de movimento que a barra.'],
      ['ex_ch_bpm', 'Supino Reto na Máquina', 'chest', 'Máquina', 'compound', 'Ideal para atingir a falha com segurança.'],
      ['ex_ch_sib', 'Supino Inclinado com Barra', 'chest', 'Barra', 'compound', 'Foco na porção superior (clavicular) do peito.'],
      ['ex_ch_sih', 'Supino Inclinado com Halteres', 'chest', 'Halteres', 'compound', 'Ângulo de 30-45 graus para melhor ativação.'],
      ['ex_ch_sim', 'Supino Inclinado na Máquina', 'chest', 'Máquina', 'compound', 'Tensão constante na porção superior.'],
      ['ex_ch_sdb', 'Supino Declinado com Barra', 'chest', 'Barra', 'compound', 'Foco na porção inferior do peitoral.'],
      ['ex_ch_sdh', 'Supino Declinado com Halteres', 'chest', 'Halteres', 'compound', 'Menos estresse no ombro que a barra.'],
      ['ex_ch_flyh', 'Crucifixo Reto com Halteres', 'chest', 'Halteres', 'isolation', 'Mantenha uma leve flexão nos cotovelos.'],
      ['ex_ch_flyp', 'Crucifixo na Polia (Crossover Alto)', 'chest', 'Polia', 'isolation', 'Foco na parte inferior e interna do peito.'],
      ['ex_ch_flypm', 'Crucifixo na Polia (Crossover Médio)', 'chest', 'Polia', 'isolation', 'Puxe em linha reta para frente.'],
      ['ex_ch_flypb', 'Crucifixo na Polia (Crossover Baixo)', 'chest', 'Polia', 'isolation', 'Foco total na porção superior.'],
      ['ex_ch_voad', 'Voador (Peck Deck)', 'chest', 'Máquina', 'isolation', 'Mantenha o peito estufado durante todo o arco.'],
      ['ex_ch_dip', 'Paralelas para Peito', 'chest', 'Peso Corporal', 'compound', 'Incline o corpo para frente.'],
      ['ex_ch_push', 'Flexão de Braços', 'chest', 'Peso Corporal', 'compound', 'Mantenha o core firme e corpo alinhado.'],
      // --- COSTAS ---
      ['ex_bk_pulm', 'Puxada Aberta na Polia', 'back', 'Polia', 'compound', 'Puxe a barra em direção ao peito, não nuca.'],
      ['ex_bk_pulf', 'Puxada Fechada (Triângulo)', 'back', 'Polia', 'compound', 'Foco na espessura das costas e latíssimo inferior.'],
      ['ex_bk_pula', 'Puxada Articulada', 'back', 'Máquina', 'compound', 'Movimento convergente para maior contração.'],
      ['ex_bk_pullup', 'Barra Fixa (Pronada)', 'back', 'Peso Corporal', 'compound', 'O "padrão ouro" para largura das costas.'],
      ['ex_bk_chinup', 'Barra Fixa (Supinada)', 'back', 'Peso Corporal', 'compound', 'Grande ativação de bíceps e latíssimo.'],
      ['ex_bk_rowb', 'Remada Curvada com Barra', 'back', 'Barra', 'compound', 'Tronco quase paralelo ao chão.'],
      ['ex_bk_rowh', 'Remada Curvada com Halteres', 'back', 'Halteres', 'compound', 'Permite rotação neutra do punho.'],
      ['ex_bk_rowu', 'Remada Unilateral (Serrote)', 'back', 'Halteres', 'compound', 'Estabilize o corpo com a mão livre no banco.'],
      ['ex_bk_rowt', 'Remada Cavalinho (T-Bar)', 'back', 'Barra', 'compound', 'Puxe com os cotovelos próximos ao corpo.'],
      ['ex_bk_rows', 'Remada Baixa Sentado', 'back', 'Polia', 'compound', 'Evite usar o impulso da lombar.'],
      ['ex_bk_rowm', 'Remada na Máquina', 'back', 'Máquina', 'compound', 'Ótimo para isolar o movimento das escápulas.'],
      ['ex_bk_pd', 'Pulldown com Corda', 'back', 'Polia', 'isolation', 'Mantenha os braços quase estendidos.'],
      ['ex_bk_dead', 'Levantamento Terra', 'back', 'Barra', 'compound', 'Exercício sistêmico; mantenha a coluna neutra.'],
      ['ex_bk_hyp', 'Extensão Lombar (Hiperestensão)', 'back', 'Banco', 'isolation', 'Fortalece os eretores da espinha.'],
      // --- OMBROS ---
      ['ex_sh_ohpb', 'Desenvolvimento Militar com Barra', 'shoulders', 'Barra', 'compound', 'Pressione a barra acima da cabeça.'],
      ['ex_sh_ohph', 'Desenvolvimento com Halteres', 'shoulders', 'Halteres', 'compound', 'Permite maior liberdade de movimento.'],
      ['ex_sh_arnold', 'Desenvolvimento Arnold', 'shoulders', 'Halteres', 'compound', 'Rotação de punho que trabalha as três cabeças.'],
      ['ex_sh_ohpm', 'Desenvolvimento na Máquina', 'shoulders', 'Máquina', 'compound', 'Seguro para altas cargas e falha técnica.'],
      ['ex_sh_lath', 'Elevação Lateral com Halteres', 'shoulders', 'Halteres', 'isolation', 'Não suba os halteres acima da linha dos ombros.'],
      ['ex_sh_latp', 'Elevação Lateral na Polia', 'shoulders', 'Polia', 'isolation', 'Tensão constante em toda a amplitude.'],
      ['ex_sh_latm', 'Elevação Lateral na Máquina', 'shoulders', 'Máquina', 'isolation', 'Isolamento máximo do deltoide lateral.'],
      ['ex_sh_frah', 'Elevação Frontal com Halteres', 'shoulders', 'Halteres', 'isolation', 'Pode ser feito de forma alternada.'],
      ['ex_sh_frab', 'Elevação Frontal com Barra', 'shoulders', 'Barra', 'isolation', 'Movimento simultâneo e rigoroso.'],
      ['ex_sh_revh', 'Crucifixo Inverso com Halteres', 'shoulders', 'Halteres', 'isolation', 'Foco no deltoide posterior.'],
      ['ex_sh_revp', 'Crucifixo Inverso na Polia', 'shoulders', 'Polia', 'isolation', 'Mantenha o braço na linha do ombro.'],
      ['ex_sh_face', 'Face Pull', 'shoulders', 'Polia', 'isolation', 'Excelente para postura e deltoide posterior.'],
      ['ex_sh_shrug', 'Encolhimento de Ombros', 'shoulders', 'Halteres', 'isolation', 'Foco na porção superior do trapézio.'],
      // --- PERNAS ---
      ['ex_lg_sqb', 'Agachamento Livre com Barra', 'legs', 'Barra', 'compound', 'Mantenha a profundidade e coluna neutra.'],
      ['ex_lg_sqh', 'Agachamento Sumô com Halter', 'legs', 'Halteres', 'compound', 'Foco em adutores e glúteo.'],
      ['ex_lg_sqs', 'Agachamento no Smith', 'legs', 'Máquina', 'compound', 'Permite posicionar os pés mais à frente.'],
      ['ex_lg_lp45', 'Leg Press 45', 'legs', 'Máquina', 'compound', 'Mantenha a lombar sempre encostada.'],
      ['ex_lg_lph', 'Leg Press Horizontal', 'legs', 'Máquina', 'compound', 'Movimento mais controlado e linear.'],
      ['ex_lg_hack', 'Hack Squat', 'legs', 'Máquina', 'compound', 'Excelente para isolar o quadríceps.'],
      ['ex_lg_ext', 'Cadeira Extensora', 'legs', 'Máquina', 'isolation', 'Pico de contração de 1s no topo.'],
      ['ex_lg_flexd', 'Mesa Flexora (Deitada)', 'legs', 'Máquina', 'isolation', 'Trabalha os posteriores de forma isolada.'],
      ['ex_lg_flexs', 'Cadeira Flexora (Sentada)', 'legs', 'Máquina', 'isolation', 'Maior alongamento dos posteriores.'],
      ['ex_lg_stiff', 'Stiff com Barra', 'legs', 'Barra', 'compound', 'Sinta o alongamento dos posteriores.'],
      ['ex_lg_rdl', 'Romanian Deadlift (RDL)', 'legs', 'Barra', 'compound', 'Joelhos semi-flexionados, foco no quadril.'],
      ['ex_lg_bulg', 'Agachamento Búlgaro', 'legs', 'Halteres', 'compound', 'O pesadelo (eficiente) de cada perna.'],
      ['ex_lg_lungb', 'Passada (Lunges) com Barra', 'legs', 'Barra', 'compound', 'Exige muito equilíbrio e força.'],
      ['ex_lg_lungh', 'Passada (Lunges) com Halteres', 'legs', 'Halteres', 'compound', 'Mais fácil de equilibrar que com barra.'],
      ['ex_lg_cals', 'Gêmeos Sentado', 'legs', 'Máquina', 'isolation', 'Foco no músculo sóleo.'],
      ['ex_lg_calp', 'Gêmeos em Pé', 'legs', 'Máquina', 'isolation', 'Foco no gastrocnêmio.'],
      ['ex_lg_callp', 'Gêmeos no Leg Press', 'legs', 'Máquina', 'isolation', 'Permite grande amplitude.'],
      ['ex_lg_add', 'Cadeira Adutora', 'legs', 'Máquina', 'isolation', 'Trabalha a parte interna da coxa.'],
      // --- BÍCEPS ---
      ['ex_bi_curb', 'Rosca Direta com Barra W', 'biceps', 'Barra', 'isolation', 'Poupa o estresse nos punhos.'],
      ['ex_bi_curh', 'Rosca Direta com Halteres', 'biceps', 'Halteres', 'isolation', 'Permite a supinação do punho.'],
      ['ex_bi_mart', 'Rosca Martelo com Halteres', 'biceps', 'Halteres', 'isolation', 'Foco no braquial e braquiorradial.'],
      ['ex_bi_incl', 'Rosca Inclinada no Banco 45', 'biceps', 'Halteres', 'isolation', 'Alongamento máximo da cabeça longa.'],
      ['ex_bi_scott', 'Rosca Scott (Barra W)', 'biceps', 'Barra', 'isolation', 'Elimina o roubo com o corpo.'],
      ['ex_bi_scotth', 'Rosca Scott Unilateral', 'biceps', 'Halteres', 'isolation', 'Corrige assimetrias.'],
      ['ex_bi_conc', 'Rosca Concentrada', 'biceps', 'Halteres', 'isolation', 'Isolamento total e pico de contração.'],
      ['ex_bi_polia', 'Rosca Direta na Polia', 'biceps', 'Polia', 'isolation', 'Tensão constante.'],
      ['ex_bi_corda', 'Rosca Martelo com Corda', 'biceps', 'Polia', 'isolation', 'Pegada neutra na polia.'],
      ['ex_bi_rev', 'Rosca Inversa', 'biceps', 'Barra', 'isolation', 'Foco no antebraço e braquiorradial.'],
      // --- TRÍCEPS ---
      ['ex_tri_pullb', 'Tríceps Pulldown (Barra Reta)', 'triceps', 'Polia', 'isolation', 'Mantenha os cotovelos colados ao corpo.'],
      ['ex_tri_pullc', 'Tríceps Pulldown (Corda)', 'triceps', 'Polia', 'isolation', 'Abra a corda no final da execução.'],
      ['ex_tri_testb', 'Tríceps Testa com Barra W', 'triceps', 'Barra', 'isolation', 'Leve a barra até a testa ou topo da cabeça.'],
      ['ex_tri_testh', 'Tríceps Testa com Halteres', 'triceps', 'Halteres', 'isolation', 'Permite movimento unilateral.'],
      ['ex_tri_fra', 'Tríceps Francês com Halter', 'triceps', 'Halteres', 'isolation', 'Alongamento da cabeça longa do tríceps.'],
      ['ex_tri_frap', 'Tríceps Francês na Polia', 'triceps', 'Polia', 'isolation', 'Tensão constante atrás da cabeça.'],
      ['ex_tri_coiceh', 'Tríceps Coice com Halter', 'triceps', 'Halteres', 'isolation', 'Estenda o cotovelo totalmente.'],
      ['ex_tri_coicep', 'Tríceps Coice na Polia', 'triceps', 'Polia', 'isolation', 'Controle o retorno do cabo.'],
      ['ex_tri_dip', 'Mergulho no Banco', 'triceps', 'Peso Corporal', 'compound', 'Mantenha as costas próximas ao banco.'],
      ['ex_tri_supf', 'Supino Fechado', 'triceps', 'Barra', 'compound', 'Pegada na largura dos ombros.'],
      // --- ABDÔMEN ---
      ['ex_ab_polia', 'Abdominal na Polia Alta', 'abs', 'Polia', 'isolation', 'Aproxime as costelas do quadril.'],
      ['ex_ab_infra', 'Elevação de Pernas', 'abs', 'Peso Corporal', 'isolation', 'Foco na porção inferior do abdômen.'],
      ['ex_ab_supr', 'Abdominal Supra (Crunch)', 'abs', 'Peso Corporal', 'isolation', 'Não puxe o pescoço com as mãos.'],
      ['ex_ab_plank', 'Prancha Isométrica', 'abs', 'Peso Corporal', 'isolation', 'Mantenha o corpo como uma prancha.'],
      ['ex_ab_wheel', 'Abdominal com Roda', 'abs', 'Roda', 'isolation', 'Nível avançado de estabilização.'],
    ];

    for (const ex of exercises) {
      await pool.query(
        `INSERT INTO exercises (id, name, muscle_group_id, equipment, type, tip) VALUES ($1, $2, $3, $4, $5, $6)`,
        ex
      );
    }
    console.log('✅ Exercícios inseridos!');

    // 5. Inserir Divisão do Usuário e Exercícios Selecionados (IDs ATUALIZADOS)
    console.log('📅 Configurando divisão de treino...');
    const divisions = [
      { day: 1, name: 'Peito, Ombro & Tríceps', muscles: ['chest', 'shoulders', 'triceps'], exercises: ['ex_ch_bpb', 'ex_ch_sih', 'ex_ch_flyp', 'ex_tri_pullb', 'ex_sh_frah'] },
      { day: 2, name: 'Costas & Bíceps', muscles: ['back', 'biceps'], exercises: ['ex_bk_rowb', 'ex_bk_pulm', 'ex_bk_rows', 'ex_bi_curb', 'ex_bi_mart'] },
      { day: 3, name: 'Pernas', muscles: ['legs'], exercises: ['ex_lg_sqb', 'ex_lg_lp45', 'ex_lg_rdl', 'ex_lg_ext', 'ex_lg_flexs'] },
      { day: 5, name: 'Peito & Tríceps', muscles: ['chest', 'triceps'], exercises: ['ex_ch_bpb', 'ex_ch_sih', 'ex_ch_flyp', 'ex_tri_pullb'] },
      { day: 6, name: 'Costas, Ombro & Bíceps', muscles: ['back', 'shoulders', 'biceps'], exercises: ['ex_bk_pulm', 'ex_bk_rowb', 'ex_sh_frah', 'ex_bi_curb'] },
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

    // 6. Inserir Histórico de Sessões Recentes
    console.log('📊 Criando sessões históricas...');
    const today = new Date();

    await pool.query(
      `INSERT INTO sessions (user_id, session_name, date, completed) VALUES ($1, $2, CURRENT_DATE, false)`,
      [userId, 'Peito, Ombro & Tríceps']
    );

    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - 3);
    const sessionRes = await pool.query(
      `INSERT INTO sessions (user_id, session_name, date, duration_min, completed) VALUES ($1, $2, $3, $4, true) RETURNING id`,
      [userId, 'Pernas', pastDate.toISOString().split('T')[0], 82]
    );
    const pastSessionId = sessionRes.rows[0].id;

    // Sets para o treino de Pernas (IDs ATUALIZADOS)
    const sets = [
      { ex: 'ex_lg_sqb', type: 'warmup', weight: 60, reps: 10, rir: null },
      { ex: 'ex_lg_sqb', type: 'work', weight: 120, reps: 8, rir: 2 },
      { ex: 'ex_lg_sqb', type: 'work', weight: 120, reps: 7, rir: 1 },
      { ex: 'ex_lg_lp45', type: 'work', weight: 240, reps: 12, rir: 2 },
      { ex: 'ex_lg_lp45', type: 'work', weight: 240, reps: 10, rir: 1 },
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