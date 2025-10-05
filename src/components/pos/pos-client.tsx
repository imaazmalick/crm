"use client";

import { useState } from "react";
import { ProductSearch } from "@/components/pos/product-search";
import { Cart } from "@/components/pos/cart";
import { CheckoutDialog } from "@/components/pos/checkout-dialog";
import { POS_FEE_AMOUNT } from "@/lib/constants";
import type { Product, CartItem } from "@/lib/types/pos";

interface POSClientProps {
  products: Product[];
  storeId: string;
  employeeId: string;
}

export function POSClient({ products, storeId, employeeId }: POSClientProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  function handleSelectProduct(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity < existing.maxStock) {
          return prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prev;
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          maxStock: product.quantity,
        },
      ];
    });
  }

  function handleUpdateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const newQuantity = Math.min(Number(quantity), item.maxStock);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  }

  function handleRemoveItem(productId: string) {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  function handleClearCart() {
    setCartItems([]);
  }

  function handleCheckoutSuccess() {
    setCartItems([]);
    setShowCheckout(false);
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductSearch
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        </div>
        <div>
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={() => setShowCheckout(true)}
            posFee={POS_FEE_AMOUNT}
          />
        </div>
      </div>

      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        items={cartItems}
        storeId={storeId}
        employeeId={employeeId}
        onSuccess={handleCheckoutSuccess}
      />
    </>
  );
}
