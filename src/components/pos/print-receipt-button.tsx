"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import {
  generateThermalReceipt,
  printThermalReceipt,
  type ReceiptData,
} from "@/lib/thermal-printer";
import { toast } from "sonner";

interface PrintReceiptButtonProps {
  receiptData: ReceiptData;
}

export function PrintReceiptButton({ receiptData }: PrintReceiptButtonProps) {
  const handlePrint = () => {
    try {
      const receiptText = generateThermalReceipt(receiptData);
      printThermalReceipt(receiptText);
      toast.success("Printing receipt...");
    } catch (error) {
      toast.error("Failed to print receipt");
      console.error(error);
    }
  };

  return (
    <Button onClick={handlePrint} variant="outline" size="sm">
      <Printer className="mr-2 h-4 w-4" />
      Print Receipt
    </Button>
  );
}
