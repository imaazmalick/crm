import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import WelcomeEmail from "@/components/emails/welcome-email";
import VerifyEmail from "@/components/emails/verify-email";
import ResetPassword from "@/components/emails/reset-password";
import SaleReceipt from "@/components/emails/sale-receipt";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const html = await render(
    WelcomeEmail({
      name,
      role,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    })
  );

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
  const html = await render(VerifyEmail({ name, otp }));

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
  otp: string
) {
  const html = await render(
    ResetPassword({
      name,
      otp,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    })
  );

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
