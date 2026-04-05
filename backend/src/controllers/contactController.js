// Contact controller — sends a contact form enquiry to the business and an auto-reply to the customer.
import nodemailer from 'nodemailer';
import { escapeHtml, stripHeaderChars, validateEmailFormat } from '../utils/sanitize.js';

// Build the transporter once at module load — reused for every request.
// Credentials are read from environment variables (never hardcoded).
const transporter = nodemailer.createTransport({
  host:   'smtp.zoho.com',
  port:   465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// verify() is a real-nodemailer method; defensive check ensures the
// transport mock in tests (which omits verify) does not crash the module.
if (
  process.env.NODE_ENV !== 'test' &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  typeof transporter.verify === 'function'
) {
  transporter.verify((error) => {
    if (error) {
      console.error('Email transporter error:', error.message);
    }
  });
}

// POST /api/contact
export const sendContactEnquiry = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, email, subject, and message are required.' });
  }

  if (!validateEmailFormat(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  try {
    const safeSubject = stripHeaderChars(subject);
    const safeEmail = stripHeaderChars(email.trim());
    const safeName = stripHeaderChars(name.trim());
    const safePhone = typeof phone === 'string' ? stripHeaderChars(phone.trim()) : '';

    const htmlName = escapeHtml(safeName);
    const htmlEmail = escapeHtml(safeEmail);
    const htmlPhone = escapeHtml(safePhone || 'Not provided');
    const htmlSubject = escapeHtml(safeSubject);
    const htmlMessage = escapeHtml(message);

    // Notification email to the business
    await transporter.sendMail({
      from: '"Promise Organics" <sales@promiseorganics.co.za>',
      to:   process.env.CONTACT_RECEIVER_EMAIL,
      subject: `New Enquiry: ${safeSubject}`,
      html: `
        <h2>New Contact Form Enquiry</h2>
        <p><strong>Name:</strong> ${htmlName}</p>
        <p><strong>Email:</strong> ${htmlEmail}</p>
        <p><strong>Phone:</strong> ${htmlPhone}</p>
        <p><strong>Subject:</strong> ${htmlSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${htmlMessage}</p>
        <hr>
        <p>Sent from Promise Organics Contact Form</p>
      `,
    });

    // Auto-reply to the customer
    await transporter.sendMail({
      from:    '"Promise Organics" <sales@promiseorganics.co.za>',
      to:      safeEmail,
      subject: 'Thanks for contacting Promise Organics',
      html: `
        <p>Hi ${htmlName},</p>
        <p>Thank you for reaching out to Promise Organics! 🌿</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p>Warm regards,<br>The Promise Organics Team</p>
      `,
    });

    res.json({ success: true, message: 'Enquiry sent successfully' });
  } catch (error) {
    console.error('Contact email error:', {
      message: error.message,
      code:    error.code,
      command: error.command,
    });
    // Never expose internal SMTP details to the client
    res.status(500).json({ success: false, message: 'Failed to send enquiry. Please try again later.' });
  }
};
