// Auth middleware — verifies the JWT Bearer token and attaches the decoded user to req.user.
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
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
