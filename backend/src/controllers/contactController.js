import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact
export const sendContactEnquiry = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, email, subject, and message are required.' });
  }

  try {
    // Notification email to the business
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to:   process.env.CONTACT_RECEIVER_EMAIL,
      subject: `New Enquiry: ${subject}`,
      html: `
        <h2>New Contact Form Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone?.trim() || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>Sent from Promise Organics Contact Form</p>
      `,
    });

    // Auto-reply to the customer
    await transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      email,
      subject: 'Thanks for contacting Promise Organics',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to Promise Organics! 🌿</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p>Warm regards,<br>The Promise Organics Team</p>
      `,
    });

    res.json({ success: true, message: 'Enquiry sent successfully' });
  } catch (err) {
    console.error('Contact email error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send enquiry' });
  }
};
