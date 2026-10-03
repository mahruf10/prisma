import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
  process.env.APP_URL || 'http://localhost:3000',
  process.env.BETTER_AUTH_URL || 'http://localhost:5000',
    "http://localhost:4000"
],
    user:{
        additionalFields: {
            role:{
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            status:{
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            }
        }
    },
    emailAndPassword: { 
        enabled: true, 
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    const info = await transporter.sendMail({
    from: '"prisma" <prisma@example.com>', // sender address
    to: `${user.email}`, // list of recipients
    subject: "Hello", // subject line
    text: "Hello world?", // plain text body
    html:`
    <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Verify your email</title> </head> <body style=" margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, Helvetica, sans-serif; color: #18181b; "> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;"> <tr> <td align="center"> <table width="100%" cellpadding="0" cellspacing="0" border="0" style=" max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; "> <!-- Header --> <tr> <td align="center" style="padding: 32px 30px 20px;"> <h1 style=" margin: 0; font-size: 28px; color: #18181b; "> Prisma </h1> </td> </tr> <!-- Content --> <tr> <td style="padding: 20px 40px 40px;"> <h2 style=" margin: 0 0 16px; font-size: 24px; color: #18181b; "> Verify your email address </h2> <p style=" margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #52525b; "> Hello ${user.name || "there"}, </p>
     <p style=" margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #52525b; "> Thanks for signing up! Please verify your email address by clicking the button below. </p> <!-- Button --> <table cellpadding="0" cellspacing="0" border="0" width="100%">
     <tr> <td align="center"> <a href="${verificationUrl}" style=" display: inline-block; padding: 14px 28px; background-color: #18181b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px; "> Verify Email Address </a> </td> </tr> </table> <p style=" margin: 28px 0 8px; font-size: 14px; line-height: 1.5; color: #71717a; "> If the button doesn't work, copy and paste this link into your browser: </p> <p style=" margin: 0; font-size: 13px; line-height: 1.5; word-break: break-all; "> <a href="${verificationUrl}" style=" color: #2563eb; text-decoration: none; "> ${verificationUrl} </a> </p> <p style=" margin: 28px 0 0; font-size: 14px; line-height: 1.5; color: #71717a; "> If you didn't create an account, you can safely ignore this email. </p> </td> </tr> <!-- Footer --> <tr> <td align="center" style=" padding: 20px 30px; background-color: #fafafa; border-top: 1px solid #e4e4e7; "> <p style=" margin: 0; font-size: 12px; color: #a1a1aa; "> © ${new Date().getFullYear()} Prisma. All rights reserved. </p> </td> </tr> </table> </td> </tr> </table> </body> </html>
    `, // HTML body
  });

  console.log("Message sent: %s", info.messageId);


    },
  },
    socialProviders: {
        google: { 
            clientId: process.env.CLIENT_ID as string, 
            clientSecret: process.env.CLIENT_SECRET as string, 
        }, 
    },
});