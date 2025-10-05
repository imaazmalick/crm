export interface ReceiptData {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  saleNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  posFee: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
}

export function generateThermalReceipt(data: ReceiptData): string {
  const width = 32; // Standard thermal printer width (32 characters)

  const center = (text: string) => {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return " ".repeat(padding) + text;
  };

  const line = () => "=".repeat(width);
  const dottedLine = () => "-".repeat(width);

  const formatRow = (left: string, right: string) => {
    const spaces = width - left.length - right.length;
    return left + " ".repeat(Math.max(1, spaces)) + right;
  };

  let receipt = "\n";
  receipt += center(data.storeName.toUpperCase()) + "\n";
  receipt += center(data.storeAddress) + "\n";
  receipt += center(data.storePhone) + "\n";
  receipt += line() + "\n";
  receipt += center("SALES RECEIPT") + "\n";
  receipt += line() + "\n";
  receipt += formatRow("Receipt #:", data.saleNumber) + "\n";
  receipt += formatRow("Date:", data.date) + "\n";
  if (data.customerName) {
    receipt += formatRow("Customer:", data.customerName) + "\n";
  }
  receipt += dottedLine() + "\n";
  receipt += "ITEM                QTY   PRICE\n";
  receipt += dottedLine() + "\n";

  data.items.forEach((item) => {
    const itemName = item.name.substring(0, 18);
    receipt += itemName + "\n";
    receipt +=
      formatRow(
        `  ${item.quantity} x Rs.${item.price.toFixed(2)}`,
        `Rs.${item.total.toFixed(2)}`
      ) + "\n";
  });

  receipt += dottedLine() + "\n";
  receipt += formatRow("Subtotal:", `Rs.${data.subtotal.toFixed(2)}`) + "\n";
  receipt += formatRow("POS Fee:", `Rs.${data.posFee.toFixed(2)}`) + "\n";
  receipt += line() + "\n";
  receipt += formatRow("TOTAL:", `Rs.${data.total.toFixed(2)}`) + "\n";
  receipt += line() + "\n";
  receipt += formatRow("Payment:", data.paymentMethod) + "\n";
  receipt += dottedLine() + "\n";
  receipt += center("Thank you for your business!") + "\n";
  receipt += center("Please come again") + "\n";
  receipt += "\n\n\n";

  return receipt;
}

export function printThermalReceipt(receiptText: string) {
  // Create a hidden iframe for printing
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 10mm;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.4;
            }
            pre {
              margin: 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          }
        </style>
      </head>
      <body>
        <pre>${receiptText}</pre>
      </body>
    </html>
  `);
  doc.close();

  // Wait for content to load then print
  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  }, 250);
}
