import { Invoice, CalculatedItem, InvoiceCalculations } from "@/types/invoice";

export const calculateInvoice = (invoice: Invoice): InvoiceCalculations => {
  // First pass: calculate without discount
  let calculatedItems: CalculatedItem[] = invoice.items.map((item) => {
    const gstRate = item.gstPercentage || 18;
    const taxableValue = item.qty * item.rate;
    const gstAmount = (taxableValue * gstRate) / 100;
    const lineTotal = taxableValue + gstAmount;

    return {
      ...item,
      taxableValue,
      gstAmount,
      lineTotal,
      discountApplied: 0,
    };
  });

  const totalTaxableAmount = calculatedItems.reduce(
    (sum, item) => sum + item.taxableValue,
    0,
  );
  const totalGst = calculatedItems.reduce(
    (sum, item) => sum + item.gstAmount,
    0,
  );
  let grandTotal = totalTaxableAmount + totalGst;
  let totalDiscount = 0;

  // If grand total override is set, use it as the grand total
  if (invoice.grandTotalOverride && invoice.grandTotalOverride > 0) {
    // Only calculate discount if override is less than calculated total
    if (invoice.grandTotalOverride < grandTotal) {
      totalDiscount = grandTotal - invoice.grandTotalOverride;

      // Distribute discount proportionally across items
      if (totalTaxableAmount > 0) {
        calculatedItems = calculatedItems.map((item) => {
          const proportion = item.taxableValue / totalTaxableAmount;
          const itemDiscount = totalDiscount * proportion;
          return {
            ...item,
            discountApplied: itemDiscount,
            lineTotal: item.lineTotal - itemDiscount,
          };
        });
      }
    }
    // Always use the override as grand total when set
    grandTotal = invoice.grandTotalOverride;
  }

  return {
    items: calculatedItems,
    totalTaxableAmount,
    totalGst,
    totalDiscount,
    grandTotal,
  };
};

export const numberToWords = (num: number): string => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + convertLessThanThousand(n % 100) : "")
    );
  };

  if (num === 0) return "Zero Rupees Only";

  const rupees = Math.round(num);

  let result = "";

  if (rupees >= 10000000) {
    result +=
      convertLessThanThousand(Math.floor(rupees / 10000000)) + " Crore ";
    num = rupees % 10000000;
  } else {
    num = rupees;
  }

  if (num >= 100000) {
    result += convertLessThanThousand(Math.floor(num / 100000)) + " Lakh ";
    num = num % 100000;
  }

  if (num >= 1000) {
    result += convertLessThanThousand(Math.floor(num / 1000)) + " Thousand ";
    num = num % 1000;
  }

  if (num > 0) {
    result += convertLessThanThousand(num);
  }

  result = result.trim() + " Rupees";

  return result + " Only";
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `INV/${year}-${month}/${random}`;
};
