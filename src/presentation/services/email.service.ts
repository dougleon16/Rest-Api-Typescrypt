import nodemailer, { Transporter } from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor(
    mailerService: string,
    mailerEmail: string,
    mailerSecretKey: string,
    private readonly postToProvider: boolean
  ) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: mailerSecretKey,
      },
    });
  }

  public async sendEmail(options: SendEmailOptions) {
    if (!this.postToProvider) return true;
    const { to, subject, htmlBody } = options;
    try {
      const sentInformation = this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
      });
      console.log(sentInformation.then((info) => console.log(info)));

      return true;
    } catch (error) {
      return;
    }
  }
}
