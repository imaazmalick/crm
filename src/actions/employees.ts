"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendWelcomeEmail } from "@/lib/email";

export async function createEmployee(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const storeId = user.storeId;

  if (!storeId) {
    return { error: "Store not found" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "EMPLOYEE" | "STORE_MANAGER";

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already exists" };
  }

  try {
    const hashedPassword = await hashPassword(password);

    const employee = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        storeId,
        emailVerified: true,
      },
    });

    await sendWelcomeEmail(email, name, role);

    // await sendEmail({
    //   to: email,
    //   subject: "Welcome to CRM System",
    //   html: getWelcomeEmailHTML(name, role),
    // });

    revalidatePath("/store/employees");
    return { success: true, employee };
  } catch (error) {
    return { error: "Failed to create employee" };
  }
}

export async function updateEmployee(employeeId: string, formData: FormData) {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  try {
    const employee = await prisma.user.update({
      where: { id: employeeId },
      data: {
        name,
        email,
      },
    });

    revalidatePath("/store/employees");
    return { success: true, employee };
  } catch (error) {
    return { error: "Failed to update employee" };
  }
}

export async function deleteEmployee(employeeId: string) {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.user.delete({
      where: { id: employeeId },
    });

    revalidatePath("/store/employees");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete employee" };
  }
}

export async function toggleEmployeeStatus(employeeId: string) {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return { error: "Employee not found" };
    }

    await prisma.user.update({
      where: { id: employeeId },
      data: {
        isActive: !employee.isActive,
      },
    });

    revalidatePath("/store/employees");
    return { success: true };
  } catch (error) {
    return { error: "Failed to toggle employee status" };
  }
}

export async function getEmployees() {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const storeId = user.storeId;

  if (!storeId) {
    return { error: "Store not found" };
  }

  const employees = await prisma.user.findMany({
    where: {
      storeId,
      role: {
        in: ["EMPLOYEE", "STORE_MANAGER"],
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { employees };
}

export async function getStoreStats() {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const storeId = user.storeId;

  if (!storeId) {
    return { error: "Store not found" };
  }

  const [
    totalProducts,
    lowStockProducts,
    totalEmployees,
    totalSales,
    totalRevenue,
  ] = await Promise.all([
    prisma.product.count({ where: { storeId } }),
    prisma.product.count({
      where: {
        storeId,
        quantity: {
          lte: prisma.product.fields.minStock,
        },
      },
    }),
    prisma.user.count({
      where: {
        storeId,
        role: {
          in: ["EMPLOYEE", "STORE_MANAGER"],
        },
      },
    }),
    prisma.sale.count({ where: { storeId } }),
    prisma.sale.aggregate({
      where: { storeId },
      _sum: {
        total: true,
      },
    }),
  ]);

  return {
    totalProducts,
    lowStockProducts,
    totalEmployees,
    totalSales,
    totalRevenue: totalRevenue._sum.total || 0,
  };
}
