// Auth service — JWT sign/verify helpers.
// TODO: authController.js defines its own inline signToken and does not import this module.
//       Either wire up this service or remove it to avoid dead code.
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const verifyToken = (token) => jwt.verify(token, config.jwtSecret);

export const generateToken = (id, email) =>
  jwt.sign({ id, email }, config.jwtSecret, { expiresIn: '7d' });
