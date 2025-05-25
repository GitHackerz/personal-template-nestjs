import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async onModuleInit() {
    try {
      await this.transporter.verify();
      console.log('Mail service is ready');
    } catch (error) {
      console.error('Mail service configuration error:', error);
    }
  }

  async sendMail(options: {
    to: string;
    subject: string;
    template: string;
    context: any;
  }): Promise<void> {
    const templatePath = path.join(
      process.cwd(),
      'src/templates',
      `${options.template}.hbs`,
    );
    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = handlebars.compile(template)(options.context);

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: options.to,
      subject: options.subject,
      html,
    });
  }
}
