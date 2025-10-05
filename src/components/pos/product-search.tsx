"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils"; // Assuming formatCurrency is a utility function to format currency
import type { Product } from "@/lib/types/pos";

interface ProductSearchProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function ProductSearch({
  products,
  onSelectProduct,
}: ProductSearchProps) {
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (search.length > 0) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.sku.toLowerCase().includes(search.toLowerCase()) ||
          product.barcode?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowResults(true);
    } else {
      setFilteredProducts([]);
      setShowResults(false);
    }
  }, [search, products]);

  function handleSelectProduct(product: Product) {
    onSelectProduct(product);
    setSearch("");
    setShowResults(false);
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products by name, SKU, or barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {showResults && filteredProducts.length > 0 && (
        <Card className="absolute z-10 mt-2 w-full max-h-96 overflow-y-auto">
          <div className="p-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelectProduct(product)}
                className="w-full text-left p-3 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>SKU: {product.sku}</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Stock: {product.quantity}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
