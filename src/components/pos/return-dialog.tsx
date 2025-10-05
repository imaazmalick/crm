"use client";

import type React from "react";

import { useState } from "react";
import { createReturn } from "@/actions/sales";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RotateCcw, CheckCircle2 } from "lucide-react";

interface Sale {
  id: string;
  saleNumber: string;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
}

interface ReturnDialogProps {
  sale: Sale;
}

export function ReturnDialog({ sale }: ReturnDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [returnQuantities, setReturnQuantities] = useState<
    Record<string, number>
  >({});
  const [reason, setReason] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const returnItems = Object.entries(returnQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    if (returnItems.length === 0) {
      setError("Please select items to return");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for return");
      return;
    }

    setLoading(true);

    const result = await createReturn(sale.id, returnItems, reason);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
        setReturnQuantities({});
        setReason("");
      }, 2000);
    }
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            Return
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Return Processed!</h2>
            <p className="text-muted-foreground">
              Items have been returned to inventory
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RotateCcw className="mr-2 h-4 w-4" />
          Return
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Process Return</DialogTitle>
          <DialogDescription>
            Sale #{sale.saleNumber} - Select items to return
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {sale.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`qty-${item.productId}`}
                      className="text-sm"
                    >
                      Return Qty:
                    </Label>
                    <Input
                      id={`qty-${item.productId}`}
                      type="number"
                      min="0"
                      max={item.quantity}
                      value={returnQuantities[item.productId] || 0}
                      onChange={(e) =>
                        setReturnQuantities({
                          ...returnQuantities,
                          [item.productId]:
                            Number.parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20"
                      disabled={loading}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Return</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Defective product, wrong item, customer changed mind, etc."
                required
                disabled={loading}
              />
            </div>

            <Alert>
              <AlertDescription>
                A 10% restocking fee will be applied to the refund amount.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Return"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
