import { Invoice, InvoiceItem } from '@/types/invoice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, X } from 'lucide-react';
import { calculateInvoice } from '@/lib/invoiceCalculations';
import { NumericInput } from './NumericInput';

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
}

export const InvoiceForm = ({ invoice, onChange }: InvoiceFormProps) => {
  const calculations = calculateInvoice(invoice);
  const hasOverride = invoice.grandTotalOverride && invoice.grandTotalOverride > 0;

  const updateField = <K extends keyof Invoice>(field: K, value: Invoice[K]) => {
    onChange({ ...invoice, [field]: value });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...invoice, items: newItems });
  };

  const addItem = () => {
    onChange({
      ...invoice,
      items: [
        ...invoice.items,
        { _key: crypto.randomUUID(), name: '', hsn: '', qty: 1, rate: 0, gstPercentage: 18 },
      ],
    });
  };

  const removeItem = (index: number) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    onChange({ ...invoice, items: newItems });
  };

  return (
    <div className="space-y-6">
      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={(e) => updateField('invoiceNumber', e.target.value)}
              placeholder="INV/2024-01/001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input
              id="invoiceDate"
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => updateField('invoiceDate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name (M/S)</Label>
            <Input
              id="customerName"
              value={invoice.customerName}
              onChange={(e) => updateField('customerName', e.target.value)}
              placeholder="Company Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              value={invoice.customerPhone}
              onChange={(e) => updateField('customerPhone', e.target.value)}
              placeholder="9876543210"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="customerAddress">Address</Label>
            <Textarea
              id="customerAddress"
              value={invoice.customerAddress}
              onChange={(e) => updateField('customerAddress', e.target.value)}
              placeholder="Full address"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerGstin">GSTIN</Label>
            <Input
              id="customerGstin"
              value={invoice.customerGstin}
              onChange={(e) => updateField('customerGstin', e.target.value)}
              placeholder="22AAAAA0000A1Z5"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Invoice Items</CardTitle>
          <Button type="button" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoice.items.map((item, index) => (
            <div key={item._key || index} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted/50 rounded-lg">
              <div className="col-span-12 md:col-span-3 space-y-1">
                <Label className="text-xs">Product/Service Name</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  placeholder="Product name"
                />
              </div>
              <div className="col-span-4 md:col-span-2 space-y-1">
                <Label className="text-xs">Product Code</Label>
                <Input
                  value={item.hsn}
                  onChange={(e) => updateItem(index, 'hsn', e.target.value)}
                  placeholder="Code"
                />
              </div>
              <div className="col-span-3 md:col-span-2 space-y-1">
                <Label className="text-xs">Qty</Label>
                <NumericInput
                  value={item.qty}
                  onChange={(val) => updateItem(index, 'qty', val)}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="col-span-4 md:col-span-2 space-y-1">
                <Label className="text-xs">Rate (₹)</Label>
                <NumericInput
                  value={item.rate}
                  onChange={(val) => updateItem(index, 'rate', val)}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="col-span-3 md:col-span-2 space-y-1">
                <Label className="text-xs">GST %</Label>
                <NumericInput
                  value={item.gstPercentage}
                  onChange={(val) => updateItem(index, 'gstPercentage', val)}
                  min={0}
                  max={100}
                  step={0.5}
                />
              </div>
              <div className="col-span-1 flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {invoice.items.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No items added. Click "Add Item" to start.
            </p>
          )}

          {/* Summary Section */}
          {invoice.items.length > 0 && (
            <div className="border-t pt-4 mt-4 space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Taxable Amount */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Total Taxable Amount</Label>
                  <div className="h-10 px-3 py-2 bg-muted rounded-md text-sm font-medium flex items-center">
                    ₹{calculations.totalTaxableAmount.toFixed(2)}
                  </div>
                </div>

                {/* GST */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Total GST</Label>
                  <div className="h-10 px-3 py-2 bg-muted rounded-md text-sm font-medium flex items-center">
                    ₹{calculations.totalGst.toFixed(2)}
                  </div>
                </div>

                {/* Discount - Only shows when override is active */}
                {true && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Discount</Label>
                    <div className="h-10 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-md text-sm font-medium flex items-center text-green-700 dark:text-green-400">
                      - ₹{calculations.totalDiscount.toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Grand Total - Editable */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Grand Total</Label>
                  <div className="flex gap-2">
                    <NumericInput
                      value={hasOverride ? (invoice.grandTotalOverride ?? 0) : (calculations.totalTaxableAmount + calculations.totalGst)}
                      onChange={(val) => {
                        if (val === 0) {
                          onChange({ ...invoice, grandTotalOverride: null });
                        } else {
                          onChange({ ...invoice, grandTotalOverride: val });
                        }
                      }}
                      className="font-medium"
                      min={0}
                      step={0.01}
                    />
                    {hasOverride && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onChange({ ...invoice, grandTotalOverride: null })}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        title="Remove override"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {hasOverride && (
                    <p className="text-xs text-muted-foreground">
                      Original: ₹{(calculations.totalTaxableAmount + calculations.totalGst).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
