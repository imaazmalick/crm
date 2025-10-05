"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

export async function createStore(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;
  const managerName = formData.get("managerName") as string;
  const managerEmail = formData.get("managerEmail") as string;
  const managerPassword = formData.get("managerPassword") as string;

  if (
    !name ||
    !email ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !zipCode ||
    !managerName ||
    !managerEmail ||
    !managerPassword
  ) {
    return { error: "All fields are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: managerEmail },
    });

    if (existingUser) {
      return { error: "Store manager email already exists" };
    }

    const hashedPassword = await bcrypt.hash(managerPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const store = await tx.store.create({
        data: {
          name,
          email,
          phone,
          address,
          city,
          state,
          zipCode,
          createdById: user.userId,
        },
      });

      const manager = await tx.user.create({
        data: {
          name: managerName,
          email: managerEmail,
          password: hashedPassword,
          role: "STORE_MANAGER",
          storeId: store.id,
          isActive: true,
          emailVerified: true,
        },
      });

      return { store, manager };
    });

    await sendWelcomeEmail(managerEmail, managerName, "STORE_MANAGER");
    // await sendWelcomeEmail(managerEmail, managerName);

    revalidatePath("/admin/stores");
    return { success: true, store: result.store };
  } catch (error) {
    console.error("[v0] Store creation error:", error);
    return { error: "Failed to create store" };
  }
}

export async function updateStore(storeId: string, formData: FormData) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;

  try {
    const store = await prisma.store.update({
      where: { id: storeId },
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
      },
    });

    revalidatePath("/admin/stores");
    return { success: true, store };
  } catch (error) {
    return { error: "Failed to update store" };
  }
}

export async function deleteStore(storeId: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.store.delete({
      where: { id: storeId },
    });

    revalidatePath("/admin/stores");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete store" };
  }
}

export async function toggleStoreStatus(storeId: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return { error: "Store not found" };
    }

    await prisma.store.update({
      where: { id: storeId },
      data: {
        isActive: !store.isActive,
      },
    });

    revalidatePath("/admin/stores");
    return { success: true };
  } catch (error) {
    return { error: "Failed to toggle store status" };
  }
}

export async function getStores() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const stores = await prisma.store.findMany({
    include: {
      _count: {
        select: {
          employees: true,
          products: true,
          sales: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { stores };
}

export async function getAdminStats() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const [totalStores, totalSales, totalRevenue, totalPosFees] =
    await Promise.all([
      prisma.store.count(),
      prisma.sale.count(),
      prisma.sale.aggregate({
        _sum: {
          total: true,
        },
      }),
      prisma.sale.aggregate({
        _sum: {
          posFee: true,
        },
      }),
    ]);

  const recentSales = await prisma.sale.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      store: true,
      employee: true,
    },
  });

  return {
    totalStores,
    totalSales,
    totalRevenue: totalRevenue._sum.total || 0,
    totalPosFees: totalPosFees._sum.posFee || 0,
    recentSales,
  };
}
