import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  from: string;
  constructor() {
    this.from = 'testingautomatedmail@gmail.com';
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      service: 'gmail',
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'testingautomatedmail@gmail.com', // generated ethereal user
        pass: 'viswcbdoxyzgafsg', // generated ethereal password
      },
    });
  }

  createEmailObject({ to, subject, html }) {
    return {
      from: this.from,
      to,
      subject,
      html,
    };
  }

  sendEmail(to, subject, html) {
    const options = {
      from: this.from,
      to: to,
      subject: subject,
      html: html,
    };
    return this.transporter.sendMail(options);
  }
}
