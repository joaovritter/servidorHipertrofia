/**
 * Servidor principal da aplicação HyperTrack.
 * Configura o Express, middlewares essenciais, conexão com rotas da API
 * e inicializa o serviço na porta definida.
 */
import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';

// Importando as rotas
import authRoutes from './routes/auth.js';
import trainingRoutes from './routes/training.js';
import workoutRoutes from './routes/workouts.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Registro de Rotas
app.use('/api/auth', authRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/workouts', workoutRoutes);

// Rota de Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.listen(port, () => {
  console.log(`🚀 Servidor HyperTrack rodando na porta ${port}`);
});
