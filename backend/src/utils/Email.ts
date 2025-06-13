import nodemailer from "nodemailer";
import { TransportOptions, Transporter } from "nodemailer";
import {
  generateForgotPasswordEmailString,
  generateVerificationEmailString,
} from "./authEmailTemplate.js";
import { UserType } from "../models/user.model.js";

// all credit goes to jonas sche.... forgot last name
export class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;
  constructor(user: UserType, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }
  newTransport(): Transporter {
    // rn i dont have send grid acc as it is review status ffs
    // if (process.env.NODE_ENV === "production") {
    //   return nodemailer.createTransport({
    //     service: "SendGrid",
    //     auth: {
    //       user: process.env.SEND_GRID_USERNAME,
    //       pass: process.env.SEND_GRID_PASSWORD,
    //     },
    //   });
    // }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST!,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME!,
        pass: process.env.EMAIL_PASSWORD!,
      },
    } as TransportOptions);
  }
  async send(template: string, subject: string) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: template,
    };

    //  create a transport and send it

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(siteName = "<--Placeholder-->") {
    const verificationEmailTemplateString = generateVerificationEmailString(
      this.firstName,
      this.url,
      siteName
    );
    await this.send(
      verificationEmailTemplateString,
      `Welcome to the ${siteName} Family!`
    );
  }

  async sendPasswordReset(siteName = "<--Placeholder-->") {
    const verificationEmailTemplateString = generateForgotPasswordEmailString(
      this.firstName,
      this.url,
      siteName
    );
    await this.send(
      verificationEmailTemplateString,
      "Your password reset token (valid for 10 mins)"
    );
  }
}

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST!,
//   port: Number(process.env.EMAIL_PORT),
//   auth: {
//     user: process.env.EMAIL_USERNAME!,
//     pass: process.env.EMAIL_PASSWORD!,
//   },
// } as TransportOptions);
// export async function sendEmail() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: forgotPasswordEmailString(),
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }
