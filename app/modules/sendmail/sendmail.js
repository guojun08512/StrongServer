
import nodemailer from 'nodemailer';

import logger from 'modules/logger';
import { mail as MailConfig } from 'modules/config';

export default class SendMails {
  constructor(content, subject, attachmentContent, attachmentfilename, receiver) {
    this.content = content;
    this.subject = subject;
    this.receiver = receiver;
    this.attachmentContent = attachmentContent || null;
    this.attachmentfilename = attachmentfilename;
    this.transport = nodemailer.createTransport(MailConfig.smtp);
  }

  sendMail() {
    const mailOptions = {
      from: MailConfig.sender,
      to: this.receiver,
      cc: MailConfig.cc,
      subject: this.subject,
      text: 'test',
      html: this.content,
      attachments: [],
    };
    if (this.attachmentContent) {
      mailOptions.attachments.push({
        filename: this.attachmentfilename,
        content: Buffer.from(this.attachmentContent, 'utf-8'),
        contentType: 'text/plain',
      });
    }
    const transport = this.transport;
    return new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          logger.info(`${this.subject} error ===> ${err}`);
          reject(err);
        } else {
          logger.info(`${this.subject} success ===> ${JSON.stringify(info)}`);
          resolve(info);
        }
      });
    });
  }
}
