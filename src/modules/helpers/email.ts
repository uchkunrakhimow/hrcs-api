import nodemailer from "nodemailer";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { logger } from "./logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendAssignmentEmail = async (to: string, link: string) => {
  const logoPath = join(process.cwd(), "public/logo.png");
  const fromName = process.env.MAIL_FROM_NAME;
  const fromEmail = process.env.MAIL_FROM || process.env.GMAIL_USER;

  const html = `
  <table width="100%" cellpadding="0" cellspacing="0"
    style="background:#f6f7fb;padding:24px;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0f1729">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;padding:40px">
          <tr>
            <td align="left" style="padding-bottom:24px">
              <img src="cid:logo" alt="logo"  style="display:block" />
            </td>
          </tr>
          <tr>
            <td style="font-size:30px;line-height:44px;font-weight:800;letter-spacing:-0.02em;padding-bottom:12px">
              Здравствуйте!</td>
          </tr>
          <tr>
            <td style="font-size:18px;line-height:32px;padding-bottom:8px">Для Вас сформирована ссылка для прохождения
              тестирования.</td>
          </tr>
          <tr>
            <td style="font-size:18px;line-height:28px;padding-bottom:8px">Вам необходимо перейти по данной ссылке,
              внимательно ознакомиться с инструкцией прохождения тестирования и пройти тестирование.</td>
          </tr>
          <tr>
            <td style="padding-top:24px;padding-bottom:8px">
              <a href="${link}"
                style="display:inline-block;background:#ed3237;color:#fff;text-decoration:none;border-radius:16px;padding:14px 18px;font-size:18px;font-weight:600">Пройти
                тестирование</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;

  try {
    await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject: "Ссылка для прохождения тестирования",
      html,
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "logo",
        },
      ],
    });
  } catch (error) {
    logger.debug(`Error sending assignment email to: ${error}`);
  }
};
