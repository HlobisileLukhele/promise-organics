import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { supabase } from '../config/supabase.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const SAFE_RESPONSE = { success: true, message: "If that email exists, a reset link has been sent." };

  // Look up user — never reveal whether email exists
  const { data: user } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email.trim().toLowerCase())
    .single();

  if (!user) return res.json(SAFE_RESPONSE);

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  const { error: insertError } = await supabase
    .from('password_reset_tokens')
    .insert({ user_id: user.id, token, expires_at });

  if (insertError) {
    console.error('Token insert error:', insertError.message);
    return res.json(SAFE_RESPONSE); // still return safe response
  }

  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000').split(',')[0].trim();
  const resetLink = `${clientUrl}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from:    '"Promise Organics" <sales@promiseorganics.co.za>',
      to:      user.email,
      subject: 'Reset Your Promise Organics Password',
      html: `
        <p>Hi,</p>
        <p>You requested a password reset for your Promise Organics account.</p>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <p><a href="${resetLink}" style="background:#7c8c7d;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Reset My Password</a></p>
        <p>If you did not request this, ignore this email.</p>
        <p>The Promise Organics Team 🌿</p>
      `,
    });
  } catch (mailErr) {
    console.error('Reset email error:', mailErr.message);
  }

  res.json(SAFE_RESPONSE);
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token?.trim() || !newPassword?.trim()) {
    return res.status(400).json({ success: false, message: 'Token and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  // Find valid, unused, non-expired token
  const { data: resetToken } = await supabase
    .from('password_reset_tokens')
    .select('id, user_id, expires_at, used')
    .eq('token', token)
    .single();

  if (!resetToken || resetToken.used || new Date(resetToken.expires_at) < new Date()) {
    return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });
  }

  const password_hash = await bcrypt.hash(newPassword, 12);

  // Update user's password
  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash })
    .eq('id', resetToken.user_id);

  if (updateError) {
    console.error('Password update error:', updateError.message);
    return res.status(500).json({ success: false, message: 'Failed to reset password. Please try again.' });
  }

  // Mark token as used
  await supabase
    .from('password_reset_tokens')
    .update({ used: true })
    .eq('id', resetToken.id);

  res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
};
