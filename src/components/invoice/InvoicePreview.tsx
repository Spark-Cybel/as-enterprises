import { forwardRef } from 'react';
import { Invoice, InvoiceCalculations } from '@/types/invoice';
import { formatCurrency, numberToWords } from '@/lib/invoiceCalculations';
import { toTitleCase } from '@/lib/utils';
import { format } from 'date-fns';
import logo from '@/assets/logo.png';

// Company contact information (same as ContactUs page)
const COMPANY_INFO = {
  phone1: '+91 94212 09422',
  email: 'as.enterprises.hq@gmail.com',
};

interface InvoicePreviewProps {
  invoice: Invoice;
  calculations: InvoiceCalculations;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoice, calculations }, ref) => {
    const formattedDate = invoice.invoiceDate
      ? format(new Date(invoice.invoiceDate), 'dd-MMM-yyyy')
      : '';

    return (
      <div
        ref={ref}
        className="bg-white text-black shadow-lg mx-auto flex flex-col"
        style={{ 
          fontFamily: 'Arial, sans-serif', 
          fontSize: '10px',
          width: '210mm',
          minHeight: '297mm',
          padding: '10mm',
          boxSizing: 'border-box',
        }}
      >
        {/* Company Header */}
        <div className="p-4 border-2 border-b-0" style={{ backgroundColor: 'hsl(33 30% 92%)', borderColor: 'hsl(30 15% 25%)' }}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <img 
                src={logo} 
                alt="AS Enterprises" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AS Enterprises</h1>
                <p className="text-sm text-gray-600">Your Trusted Partner</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p><strong>Phone:</strong> {COMPANY_INFO.phone1}</p>
              <p><strong>Email:</strong> {COMPANY_INFO.email}</p>
            </div>
          </div>
        </div>

        {/* Invoice Title */}
        <div className="text-center py-2 border-2" style={{ borderColor: 'hsl(30 15% 25%)' }}>
          <h2 className="text-2xl font-bold" style={{ color: 'hsl(33 40% 45%)' }}>INVOICE</h2>
        </div>

        {/* Invoice Meta & Customer Details */}
        <div className="grid grid-cols-2 border-2 border-t-0" style={{ borderColor: 'hsl(30 15% 25%)' }}>
          {/* Customer Details */}
          <div className="border-r p-3" style={{ borderColor: 'hsl(30 15% 25%)' }}>
            <h3 className="font-bold px-2 py-1 mb-2 text-sm" style={{ backgroundColor: 'hsl(33 30% 85%)' }}>Customer Details</h3>
            <table className="w-full text-sm ml-2">
              <tbody>
                <tr>
                  <td className="font-semibold w-20 py-1">M/S</td>
                  <td>{invoice.customerName || '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 align-top">Address</td>
                  <td className="whitespace-pre-line">{invoice.customerAddress || '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1">Phone</td>
                  <td>{invoice.customerPhone || '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1">GSTIN</td>
                  <td>{invoice.customerGstin || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Invoice Details */}
          <div className="p-3">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold px-2 py-1" style={{ backgroundColor: 'hsl(33 30% 85%)' }}>Invoice No.</td>
                  <td className="px-2 py-1">{invoice.invoiceNumber || '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold px-2 py-1" style={{ backgroundColor: 'hsl(33 30% 85%)' }}>Invoice Date</td>
                  <td className="px-2 py-1">{formattedDate || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Items Table with Totals - Single table */}
        <div className="flex-grow flex flex-col">
          <table 
            className="w-full border-collapse border-2 border-t-0" 
            style={{ flexGrow: 1, height: '1px', borderColor: 'hsl(30 15% 25%)' }}
          >
            <thead className="text-[11px]">
              <tr style={{ backgroundColor: 'hsl(33 30% 85%)' }}>
                <th className="border-l-2 border-r border-b px-2 py-2 text-center whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', minWidth: '25px' }}>Sr.</th>
                <th className="border-r border-b px-2 py-2 text-left" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>Name of Product / Service</th>
                <th className="border-r border-b px-2 py-2 text-center whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', minWidth: '55px' }}>Product Code</th>
                <th className="border-r border-b px-2 py-2 text-center whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', minWidth: '35px' }}>Qty</th>
                <th className="border-r border-b px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', minWidth: '50px' }}>Rate</th>
                <th className="border-r border-b px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 78%)', minWidth: '60px' }}>Taxable Value</th>
                <th className="border-r border-b px-2 py-2 text-center whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 78%)', minWidth: '35px' }}>GST %</th>
                <th className="border-r border-b px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 78%)', minWidth: '50px' }}>GST Amt</th>
                <th className="border-r-2 border-b px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', minWidth: '60px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Item rows */}
              {calculations.items.map((item, index) => (
                <tr key={item._key || index}>
                  <td className="border-l-2 border-r border-b px-2 py-2 text-center whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>{index + 1}</td>
                  <td className="border-r border-b px-2 py-2" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>{item.name || '-'}</td>
                  <td className="border-r border-b px-2 py-2 text-center whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>{item.hsn || '-'}</td>
                  <td className="border-r border-b px-2 py-2 text-center whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>{item.qty}</td>
                  <td className="border-r border-b px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>{formatCurrency(item.rate)}</td>
                  <td className="border-r border-b px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 92%)' }}>
                    {formatCurrency(item.taxableValue)}
                  </td>
                  <td className="border-r border-b px-2 py-2 text-center whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 92%)' }}>
                    {item.gstPercentage}%
                  </td>
                  <td className="border-r border-b px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 92%)' }}>
                    {formatCurrency(item.gstAmount)}
                  </td>
                  <td className="border-r-2 border-b px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>
                    {formatCurrency(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Spacer tbody - expands to fill space */}
            <tbody style={{ height: '100%' }}>
              <tr>
                <td className="border-l-2 border-r" style={{ borderColor: 'hsl(30 15% 25%)' }}></td>
                <td className="border-r" style={{ borderColor: 'hsl(30 15% 25%)' }}></td>
                <td className="border-r" style={{ borderColor: 'hsl(30 15% 25%)' }}></td>
                <td className="border-r" style={{ borderColor: 'hsl(30 15% 25%)' }}></td>
                <td className="border-r" style={{ borderColor: 'hsl(30 15% 25%)' }}></td>
                <td className="border-r" style={{ borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 92%)' }}></td>
                <td className="border-r" style={{ borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 92%)' }}></td>
                <td className="border-r" style={{ borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 92%)' }}></td>
                <td className="border-r-2" style={{ borderColor: 'hsl(30 15% 25%)' }}></td>
              </tr>
            </tbody>
            <tfoot className="text-[11px]">
              {/* Totals Row */}
              <tr className="font-semibold" style={{ backgroundColor: 'hsl(33 30% 85%)' }}>
                <td className="border-r border-t px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>Total</td>
                {/* <td className="border-l-2 border-r border-t px-2 py-2" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}></td> */}
                <td className="border-r border-t px-2 py-2" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}></td>
                <td className="border-r border-t px-2 py-2" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}></td>
                <td className="border-r border-t px-2 py-2 text-center whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>
                  {calculations.items.reduce((sum, item) => sum + item.qty, 0)}
                </td>
                <td className="border-r border-t px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}></td>
                {/* <td className="border-r border-t px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>Total</td> */}
                <td className="border-r border-t px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 78%)' }}>
                  {formatCurrency(calculations.totalTaxableAmount)}
                </td>
                <td className="border-r border-t px-2 py-2 text-center whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 78%)' }}></td>
                <td className="border-r border-t px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)', backgroundColor: 'hsl(33 30% 78%)' }}>
                  {formatCurrency(calculations.totalGst)}
                </td>
                <td className="border-r-2 border-t px-2 py-2 text-right whitespace-nowrap" style={{ verticalAlign: 'top', borderColor: 'hsl(30 15% 25%)' }}>
                  {formatCurrency(calculations.grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 border-2 border-t-0 border-b-0" style={{ borderColor: 'hsl(30 15% 25%)' }}>
          {/* Amount in Words */}
          <div className="border-r p-3" style={{ borderColor: 'hsl(30 15% 25%)' }}>
            <h3 className="font-bold mb-2">Invoice Total in Words</h3>
            <p className="font-semibold text-sm">
              {toTitleCase(numberToWords(calculations.grandTotal))}
            </p>
          </div>

          {/* Summary Table */}
          <div className="p-3">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold py-1">Taxable Amount</td>
                  <td className="text-right py-1">{formatCurrency(calculations.totalTaxableAmount)}</td>
                </tr>
                <tr>
                  <td className="py-1">Add: GST</td>
                  <td className="text-right py-1">{formatCurrency(calculations.totalGst)}</td>
                </tr>
                {calculations.totalDiscount > 0 && (
                  <tr>
                    <td className="py-1 text-green-700">Less: Discount</td>
                    <td className="text-right py-1 text-green-700">- {formatCurrency(calculations.totalDiscount)}</td>
                  </tr>
                )}
                <tr className="font-bold border-t border-gray-400">
                  <td className="py-2">Grand Total</td>
                  <td className="text-right py-2">{formatCurrency(calculations.grandTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-2 p-4" style={{ borderColor: 'hsl(30 15% 25%)' }}>
          <div className="flex justify-between items-end">
            <div className="text-xs text-gray-600">
              <p>Certified that the particulars given above are true and correct.</p>
            </div>
            <div className="text-center">
              <p className="font-bold mb-8">For, AS Enterprises</p>
              <p className="border-t border-gray-400 pt-2 text-sm">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';