const nodemailer = require("nodemailer");

exports.MailService = class {
  static async sendMail({ to, subject, html, attachments, from }) {
    try {
      let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: `"Miko POS" <${process.env.MAIL_FROM}>`,
        to,
        subject,
        html,
        attachments,
      });

      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
