/**
 * Rotas de autenticação.
 * Gerencia o registro de novos usuários e o processo de login, 
 * utilizando bcrypt para segurança de senhas e JWT para emissão de tokens.
 */
import express from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fallback para teste (conforme server.js original)
    if (email === "alex@hypertrack.app" && password === "mypassword") {
      const token = jwt.sign({ id: 1, email }, process.env.JWT_SECRET || "default_secret", { expiresIn: '7d' });
      return res.json({
        user: { id: 1, name: "Alex Costa", email, initials: "AC", weight: 82, onboarded: true },
        token
      });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        weight: user.weight,
        onboarded: !!user.weight
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no login' });
  }
});

export default router;
