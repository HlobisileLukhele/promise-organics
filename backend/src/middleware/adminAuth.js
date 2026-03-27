// Admin auth middleware — verifies the JWT and confirms the user has role = 'admin' in the database.
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { supabase } from '../config/supabase.js';
export const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid or expired token.' });
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', decoded.id)
    .single();

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
  }

  req.user = decoded;
  next();
};
