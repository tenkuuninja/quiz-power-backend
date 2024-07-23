import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import ejs from 'ejs';
import path from 'path';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtpCode(email: string, otp: string) {
    const templatePath = path.join(
      __dirname,
      './templates/send-otp.template.ejs',
    );
    const html = await ejs.renderFile(templatePath, { otp });

    await this.mailerService.sendMail({
      to: email,
      subject: '[QuizPower] Reset Password code',
      html: html,
    });
  }
}
