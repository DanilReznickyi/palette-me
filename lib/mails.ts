import nodemailer from "nodemailer";

export async function sendCodeEmail(to: string, code: string) {
  let transporter;
  if (!process.env.SMTP_HOST) {
    // dev: Ethereal
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: await nodemailer.createTestAccount(),
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  const info = await transporter.sendMail({
    from: '"PaletteMe" <no-reply@paletteme.local>',
    to,
    subject: "Your verification code",
    text: `Your verification code: ${code}`,
    html: `<p>Your verification code: <b>${code}</b></p>`,
  });

  // Для Ethereal можно посмотреть превью ссылку в консоли
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailerTest = require("nodemailer").getTestMessageUrl;
    const url = nodemailerTest?.(info);
    if (url) console.log("Ethereal preview:", url);
  } catch {}
}
