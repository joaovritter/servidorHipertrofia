/**
 * Middleware de autenticação JWT.
 * Responsável por verificar a validade do token no cabeçalho de autorização,
 * garantindo que apenas usuários autenticados acessem rotas protegidas.
 * Se o token for válido, os dados do usuário são anexados a 'req.user'.
 */
import jwt from 'jsonwebtoken';


export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });
    req.user = user;
    next();
  });
};
