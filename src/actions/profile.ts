"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function updateProfile(formData: FormData) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return { success: false, error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) {
      return { success: false, error: "Name and email are required" };
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: payload.userId },
      },
    });

    if (existingUser) {
      return { success: false, error: "Email is already taken" };
    }

    await prisma.user.update({
      where: { id: payload.userId },
      data: { name, email },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/store/settings");
    revalidatePath("/pos/settings");

    return { success: true };
  } catch (error) {
    console.error("[v0] Profile update error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function changePassword(formData: FormData) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return { success: false, error: "Unauthorized" };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "All fields are required" };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "New passwords do not match" };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("[v0] Password change error:", error);
    return { success: false, error: "Failed to change password" };
  }
}
