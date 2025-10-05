export const POS_FEE_AMOUNT = 1; // Fixed PKR amount per transaction
export const CURRENCY = "PKR";
export const CURRENCY_SYMBOL = "Rs.";

export function formatCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL} ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
