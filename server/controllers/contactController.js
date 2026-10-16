import nodemailer from 'nodemailer';
import Contact from '../models/Contact.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, company, phone, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Save to DB
    let contact = null;
    try {
      contact = await Contact.create({
        name,
        email,
        company: company || '',
        phone: phone || '',
        message,
        ipAddress: req.ip,
      });
      console.log('✅ Contact saved:', contact._id);
    } catch (dbErr) {
      console.warn('⚠️  DB save failed:', dbErr.message);
    }

    // Send email (non-blocking)
    try {
      await sendContactEmail({ name, email, company, phone, message });
    } catch (mailErr) {
      console.warn('⚠️  Email failed:', mailErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Message saved successfully!',
      id: contact?._id,
    });
  } catch (error) {
    next(error);
  }
};

async function sendContactEmail({ name, email, company, phone, message }) {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_TO } = process.env;

  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS || !MAIL_TO) {
    console.log('📧 Mail not configured — skipping email');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT) || 587,
    secure: false,
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #0F4C81;">New Contact Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background: #f8fafc; padding: 12px;">${message}</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Divyaputri Tradex" <${MAIL_USER}>`,
    to: MAIL_TO,
    replyTo: email,
    subject: `New Contact: ${name}`,
    html,
  });
}