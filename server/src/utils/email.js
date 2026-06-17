import nodemailer from 'nodemailer';

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendVerificationEmail({ to, token, clientUrl }) {
  const baseUrl = clientUrl || process.env.CLIENT_URL || 'http://127.0.0.1:5173';
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`;
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`Email verification link for ${to}: ${verifyUrl}`);
    return { previewUrl: verifyUrl, sent: false };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'Xác nhận tài khoản DN Apartment Hub',
    html: `
      <h2>Xác nhận tài khoản DN Apartment Hub</h2>
      <p>Cảm ơn bạn đã đăng ký. Bấm vào liên kết bên dưới để xác nhận email:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>Liên kết có hiệu lực trong 24 giờ.</p>
    `
  });

  return { sent: true };
}
