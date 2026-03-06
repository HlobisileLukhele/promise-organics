import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// Verifies the JWT from the Authorization Bearer header
// and attaches { id, email } to req.user
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid or expired token.' });
  }
};
