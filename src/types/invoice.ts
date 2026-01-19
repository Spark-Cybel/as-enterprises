export interface InvoiceItem {
  _key?: string;
  name: string;
  hsn: string;
  qty: number;
  rate: number;
  gstPercentage: number;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerGstin: string;
  items: InvoiceItem[];
  grandTotalOverride?: number | null;
  createdAt?: string;
}

export interface CalculatedItem extends InvoiceItem {
  taxableValue: number;
  gstAmount: number;
  lineTotal: number;
  discountApplied: number;
}

export interface InvoiceCalculations {
  items: CalculatedItem[];
  totalTaxableAmount: number;
  totalGst: number;
  totalDiscount: number;
  grandTotal: number;
}
