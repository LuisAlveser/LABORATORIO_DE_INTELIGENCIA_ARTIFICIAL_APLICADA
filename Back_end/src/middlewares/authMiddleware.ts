import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  nome: string;
  email: string;
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: 'Token de autenticação não fornecido.' });
  }

 
  const parts = authorization.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ mensagem: 'Erro no formato do Token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ mensagem: 'Token malformatado.' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.TOKEN_SEGREDO!) as TokenPayload;

    
    req.user = {
      id: decoded.id,
      nome: decoded.nome,
      email: decoded.email
    };

  
    return next();

  } catch (error) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}