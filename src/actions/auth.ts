"use server";

import { prisma } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createToken,
  setAuthCookie,
  clearAuthCookie,
  generateOTP,
  generateResetToken,
} from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "@/lib/email";

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already exists" };
  }

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN", // First user is admin, others will be created by admin
      otpCode: otp,
      otpExpiry,
    },
  });

  await sendVerificationEmail(email, name, otp);

  // await sendEmail({
  //   to: email,
  //   subject: "Verify Your Email - CRM System",
  //   html: getOTPEmailHTML(otp, name),
  // });

  return { success: true, userId: user.id };
}

export async function verifyEmail(userId: string, otp: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User not found" };
  }

  if (!user.otpCode || !user.otpExpiry) {
    return { error: "No OTP found" };
  }

  if (user.otpExpiry < new Date()) {
    return { error: "OTP expired" };
  }

  if (user.otpCode !== otp) {
    return { error: "Invalid OTP" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: true,
      otpCode: null,
      otpExpiry: null,
    },
  });

  await sendWelcomeEmail(user.email, user.name, user.role);

  // await sendEmail({
  //   to: user.email,
  //   subject: "Welcome to CRM System",
  //   html: getWelcomeEmailHTML(user.name, user.role),
  // });

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    storeId: user.storeId || undefined,
  });

  await setAuthCookie(token);

  return { success: true };
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "All fields are required" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Invalid credentials" };
  }

  if (!user.isActive) {
    return { error: "Account is deactivated" };
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return { error: "Invalid credentials" };
  }

  if (!user.emailVerified) {
    return { error: "Please verify your email first", userId: user.id };
  }

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    storeId: user.storeId || undefined,
  });

  await setAuthCookie(token);

  // Redirect based on role
  if (user.role === "ADMIN") {
    redirect("/admin");
  } else if (user.role === "STORE_MANAGER") {
    redirect("/store");
  } else {
    redirect("/pos");
  }
}

export async function signOut() {
  await clearAuthCookie();
  redirect("/login");
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: true }; // Don't reveal if user exists
  }

  const resetToken = generateResetToken();
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  const resetLink = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/reset-password?token=${resetToken}`;

  await sendPasswordResetEmail(email, user.name, resetLink);

  // await sendEmail({
  //   to: email,
  //   subject: "Reset Your Password - CRM System",
  //   html: getResetPasswordEmailHTML(resetLink, user.name),
  // });

  return { success: true };
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return { error: "Invalid or expired reset token" };
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { success: true };
}

export async function resendOTP(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      otpCode: otp,
      otpExpiry,
    },
  });

  await sendVerificationEmail(user.email, user.name, otp);
  // await sendEmail({
  //   to: user.email,
  //   subject: "Verify Your Email - CRM System",
  //   html: getOTPEmailHTML(otp, user.name),
  // });

  return { success: true };
}
