-- Limpa as tabelas existentes para recriar (CUIDADO: apaga dados!)

DROP TABLE IF EXISTS sets CASCADE;  
DROP TABLE IF EXISTS set_logs CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS user_exercises CASCADE;
DROP TABLE IF EXISTS user_divisions CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS muscle_groups CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Tabela de Usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  age INT,
  goal VARCHAR(50),
  experience VARCHAR(50),
  injuries TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Grupos Musculares
CREATE TABLE muscle_groups (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- 3. Tabela Global de Exercícios (Banco de Exercícios)
CREATE TABLE exercises (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  muscle_group_id VARCHAR(50) REFERENCES muscle_groups(id),
  equipment VARCHAR(50),
  type VARCHAR(20) NOT NULL, -- "compound", "isolation"
  tip TEXT
);

-- 3. Divisão de Treino do Usuário
-- Representa a semana de treino (0=Dom, 1=Seg, 2=Ter, etc.) e os músculos treinados
CREATE TABLE user_divisions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  name VARCHAR(100) NOT NULL,
  muscles TEXT[] NOT NULL, -- Array de strings (ex: '{"chest", "triceps"}')
  UNIQUE(user_id, day_of_week)
);

-- 4. Exercícios Selecionados para a Divisão do Usuário
-- Guarda quais exercícios o usuário escolheu para fazer em um dia específico da semana
CREATE TABLE user_exercises (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  exercise_id VARCHAR(50) REFERENCES exercises(id),
  order_idx INT NOT NULL, -- Ordem do exercício no treino
  UNIQUE(user_id, day_of_week, exercise_id)
);

-- 5. Tabela de Sessões de Treino Realizadas (Histórico)
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  session_name VARCHAR(100) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_min INT,
  completed BOOLEAN DEFAULT false,
  ai_feedback JSONB, -- Avaliação gerada pelo Gemini
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela de Séries Realizadas (Histórico de Cargas)
CREATE TABLE set_logs (
  id SERIAL PRIMARY KEY,
  session_id INT REFERENCES sessions(id) ON DELETE CASCADE,
  exercise_id VARCHAR(50) REFERENCES exercises(id),
  type VARCHAR(20) NOT NULL, -- 'warmup', 'feeder', 'work'
  weight DECIMAL(6,2) NOT NULL,
  reps INT NOT NULL,
  rir INT,
  completed BOOLEAN DEFAULT true,
  ai_target_weight DECIMAL(6,2),
  ai_target_reps INT,
  ai_target_rir INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
