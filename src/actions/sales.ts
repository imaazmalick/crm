"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export async function createSale(
  cartItems: CartItem[],
  customerInfo: {
    name?: string;
    email?: string;
    phone?: string;
  },
  paymentMethod: string
) {
  const user = await getCurrentUser();

  if (!user || !["EMPLOYEE", "STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const storeId = user.storeId;

  if (!storeId) {
    return { error: "Store not found" };
  }

  if (cartItems.length === 0) {
    return { error: "Cart is empty" };
  }

  try {
    // Get system settings for POS fee
    let settings = await prisma.systemSettings.findFirst();
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {},
      });
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * (settings.taxPercent / 100);
    const posFee = settings.posFeeAmount;
    const total = subtotal + tax + posFee;

    // Generate sale number
    const saleCount = await prisma.sale.count();
    const saleNumber = `SALE-${String(saleCount + 1).padStart(6, "0")}`;

    // Create sale with items
    const sale = await prisma.sale.create({
      data: {
        saleNumber,
        subtotal,
        tax,
        posFee,
        total,
        paymentMethod,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        storeId,
        employeeId: user.userId,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product quantities
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    revalidatePath("/pos");
    return { success: true, sale };
  } catch (error) {
    console.error("Sale creation error:", error);
    return { error: "Failed to create sale" };
  }
}

export async function createReturn(
  saleId: string,
  returnItems: { productId: string; quantity: number }[],
  reason: string
) {
  const user = await getCurrentUser();

  if (!user || !["EMPLOYEE", "STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const storeId = user.storeId;

  if (!storeId) {
    return { error: "Store not found" };
  }

  try {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      return { error: "Sale not found" };
    }

    // Calculate refund amount
    let refundAmount = 0;
    const returnItemsData = [];

    for (const returnItem of returnItems) {
      const saleItem = sale.items.find(
        (item: any) => item.productId === returnItem.productId
      );
      if (!saleItem) {
        return { error: "Invalid return item" };
      }

      if (returnItem.quantity > saleItem.quantity) {
        return { error: "Return quantity exceeds sale quantity" };
      }

      const itemRefund = saleItem.price * returnItem.quantity;
      refundAmount += itemRefund;

      returnItemsData.push({
        productId: returnItem.productId,
        quantity: returnItem.quantity,
        price: saleItem.price,
        subtotal: itemRefund,
      });

      // Update product quantity
      await prisma.product.update({
        where: { id: returnItem.productId },
        data: {
          quantity: {
            increment: returnItem.quantity,
          },
        },
      });
    }

    const restockFee = refundAmount * 0.1; // 10% restocking fee
    const totalRefund = refundAmount - restockFee;

    // Generate return number
    const returnCount = await prisma.return.count();
    const returnNumber = `RET-${String(returnCount + 1).padStart(6, "0")}`;

    // Create return
    const returnRecord = await prisma.return.create({
      data: {
        returnNumber,
        reason,
        refundAmount,
        restockFee,
        totalRefund,
        saleId,
        storeId,
        employeeId: user.userId,
        items: {
          create: returnItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update sale status
    const allItemsReturned = sale.items.every((saleItem: any) => {
      const returnedQty =
        returnItems.find((ri) => ri.productId === saleItem.productId)
          ?.quantity || 0;
      return returnedQty === saleItem.quantity;
    });

    await prisma.sale.update({
      where: { id: saleId },
      data: {
        status: allItemsReturned ? "RETURNED" : "PARTIAL_RETURN",
      },
    });

    revalidatePath("/pos");
    revalidatePath("/pos/returns");
    return { success: true, return: returnRecord };
  } catch (error) {
    console.error("Return creation error:", error);
    return { error: "Failed to create return" };
  }
}

export async function getSales() {
  const user = await getCurrentUser();

  if (!user || !["EMPLOYEE", "STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const storeId = user.storeId;

  if (!storeId) {
    return { error: "Store not found" };
  }

  const sales = await prisma.sale.findMany({
    where: { storeId },
    include: {
      employee: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return { sales };
}

export async function getReturns() {
  const user = await getCurrentUser();

  if (!user || !["EMPLOYEE", "STORE_MANAGER", "ADMIN"].includes(user.role)) {
    return { error: "Unauthorized" };
  }

  const storeId = user.storeId;

  if (!storeId) {
    return { error: "Store not found" };
  }

  const returns = await prisma.return.findMany({
    where: { storeId },
    include: {
      employee: true,
      sale: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return { returns };
}
