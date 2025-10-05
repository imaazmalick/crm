import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import SaleReceipt from "../components/emails/sale-receipt";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

export function getOTPEmailHTML(otp: string, name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 8px; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .otp-code { background-color: #2a2a2a; border: 2px solid #3a3a3a; border-radius: 8px; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; color: #10b981; }
          .footer { text-align: center; margin-top: 30px; color: #888; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <p>Hi ${name},</p>
          <p>Thank you for signing up! Please use the following OTP code to verify your email address:</p>
          <div class="otp-code">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
          <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getResetPasswordEmailHTML(
  resetLink: string,
  name: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 8px; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .button { display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #888; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #10b981;">${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getWelcomeEmailHTML(name: string, role: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 8px; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .role-badge { display: inline-block; background-color: #10b981; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 14px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #888; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to CRM System!</h1>
          </div>
          <p>Hi ${name},</p>
          <p>Your email has been verified successfully. Welcome to our CRM system!</p>
          <p>Your role: <span class="role-badge">${role}</span></p>
          <p>You can now log in and start using the system.</p>
          <div class="footer">
            <p>Thank you for joining us!</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const html = getWelcomeEmailHTML(name, role);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Welcome to CRM System",
    html,
  });
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  otp: string
) {
  const html = getOTPEmailHTML(otp, name);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Verify Your Email",
    html,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetLink: string
) {
  const html = getResetPasswordEmailHTML(resetLink, name);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Reset Your Password",
    html,
  });
}

export async function sendSaleReceipt(
  to: string,
  storeName: string,
  saleId: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  subtotal: number,
  posFee: number,
  total: number,
  paymentMethod: string,
  date: string
) {
  const html = await render(
    SaleReceipt({
      storeName,
      saleId,
      items,
      subtotal,
      posFee,
      total,
      paymentMethod,
      date,
    })
  );

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Receipt from ${storeName}`,
    html,
  });
}
