"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const storeId =
    user.role === "ADMIN" ? (formData.get("storeId") as string) : user.storeId;

  if (!storeId) {
    return { error: "Store not found" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const barcode = formData.get("barcode") as string;
  const price = Number.parseFloat(formData.get("price") as string);
  const cost = Number.parseFloat(formData.get("cost") as string);
  const quantity = Number.parseInt(formData.get("quantity") as string);
  const minStock = Number.parseInt(formData.get("minStock") as string);
  const category = formData.get("category") as string;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        sku,
        barcode,
        price,
        cost,
        quantity,
        minStock,
        category,
        storeId,
      },
    });

    revalidatePath("/store/inventory");
    return { success: true, product };
  } catch (error) {
    return { error: "Failed to create product. SKU might already exist." };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number.parseFloat(formData.get("price") as string);
  const cost = Number.parseFloat(formData.get("cost") as string);
  const quantity = Number.parseInt(formData.get("quantity") as string);
  const minStock = Number.parseInt(formData.get("minStock") as string);
  const category = formData.get("category") as string;

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        cost,
        quantity,
        minStock,
        category,
      },
    });

    revalidatePath("/store/inventory");
    return { success: true, product };
  } catch (error) {
    return { error: "Failed to update product" };
  }
}

export async function deleteProduct(productId: string) {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/store/inventory");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete product" };
  }
}

export async function getProducts() {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const storeId = user.storeId;

  if (!storeId) {
    return { error: "Store not found" };
  }

  const products = await prisma.product.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  return { products };
}
