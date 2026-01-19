import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InvoicePasswordGate } from '@/components/invoice/InvoicePasswordGate';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { Invoice } from '@/types/invoice';
import { calculateInvoice, generateInvoiceNumber } from '@/lib/invoiceCalculations';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Download, Save, RefreshCw, Eye, Edit, Plus, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { writeClient } from '@/sanity/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const createDefaultInvoice = (): Invoice => ({
  invoiceNumber: generateInvoiceNumber(),
  invoiceDate: new Date().toISOString().split('T')[0],
  customerName: '',
  customerAddress: '',
  customerPhone: '',
  customerGstin: '',
  items: [],
  grandTotalOverride: null,
});

// Sanity queries for invoices
const getAllInvoices = async (): Promise<Invoice[]> => {
  const results = await writeClient.fetch(`
    *[_type == "invoice"] | order(createdAt desc) {
      _id,
      invoiceNumber,
      invoiceDate,
      customerName,
      customerAddress,
      customerPhone,
      customerGstin,
      items,
      grandTotalOverride,
      createdAt
    }
  `);
  
  // Ensure items have gstPercentage with default value
  return results.map((inv: Invoice) => ({
    ...inv,
    items: (inv.items || []).map((item) => ({
      ...item,
      gstPercentage: item.gstPercentage ?? 18,
    })),
  }));
};

const saveInvoice = async (invoice: Invoice): Promise<Invoice> => {
  const doc = {
    _type: 'invoice',
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate,
    customerName: invoice.customerName,
    customerAddress: invoice.customerAddress,
    customerPhone: invoice.customerPhone,
    customerGstin: invoice.customerGstin,
    items: invoice.items.map((item) => ({
      _key: item._key || crypto.randomUUID(),
      _type: 'object',
      name: item.name,
      hsn: item.hsn,
      qty: item.qty,
      rate: item.rate,
      gstPercentage: item.gstPercentage ?? 18,
    })),
    grandTotalOverride: invoice.grandTotalOverride,
    createdAt: new Date().toISOString(),
  };

  if (invoice._id) {
    return writeClient.patch(invoice._id).set(doc).commit();
  }
  return writeClient.create(doc);
};

const InvoiceGeneratorContent = () => {
  const [invoice, setInvoice] = useState<Invoice>(createDefaultInvoice);
  const [activeTab, setActiveTab] = useState('edit');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all invoices
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: getAllInvoices,
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: saveInvoice,
    onSuccess: (savedInvoice) => {
      toast({ title: 'Invoice saved successfully!' });
      setInvoice({ ...invoice, _id: savedInvoice._id });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast({
        title: 'Failed to save invoice',
        description: 'Please check your Sanity configuration and try again.',
        variant: 'destructive',
      });
    },
  });

  const calculations = calculateInvoice(invoice);

  const handleSave = () => {
    saveMutation.mutate(invoice);
  };

  const handleNewInvoice = () => {
    setInvoice(createDefaultInvoice());
  };

  const handleLoadInvoice = (invoiceId: string) => {
    const selectedInvoice = invoices.find((inv) => inv._id === invoiceId);
    if (selectedInvoice) {
      setInvoice(selectedInvoice);
      toast({ title: `Loaded invoice ${selectedInvoice.invoiceNumber}` });
    }
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;

    setIsGeneratingPdf(true);
    
    // Fix for html2canvas text alignment issue with Tailwind CSS
    // Tailwind's preflight sets img { display: block } which causes text to shift down
    // This temporary style fixes the issue during PDF generation
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');
    
    try {
      // Switch to preview tab for screenshot
      setActiveTab('preview');
      await new Promise((resolve) => setTimeout(resolve, 100));

      const previewElement = previewRef.current;
      
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const pdfWidth = 210; // A4 width in mm
      const minPdfHeight = 297; // A4 height in mm (minimum)
      
      // Calculate the actual height based on content
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      const actualPdfHeight = Math.max(imgHeight, minPdfHeight);

      // Create PDF with custom height (minimum A4)
      const pdf = new jsPDF('p', 'mm', [pdfWidth, actualPdfHeight]);

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        pdfWidth,
        imgHeight
      );

      pdf.save(`${invoice.invoiceNumber.replace(/\//g, '-')}.pdf`);
      toast({ title: 'PDF downloaded successfully!' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'Failed to generate PDF',
        variant: 'destructive',
      });
    } finally {
      // Clean up the temporary style fix
      style.remove();
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/" title="Go to Home">
                  <Home className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold">Invoice Generator</h1>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Internal
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select onValueChange={handleLoadInvoice} disabled={isLoadingInvoices}>
                <SelectTrigger className="w-[200px] bg-background text-foreground">
                  <SelectValue placeholder="Load previous invoice" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((inv) => (
                    <SelectItem key={inv._id} value={inv._id!}>
                      {inv.invoiceNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="secondary" size="sm" onClick={handleNewInvoice} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saveMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </Button>
              <Button size="sm" onClick={handleDownloadPdf} disabled={isGeneratingPdf}>
                {isGeneratingPdf ? (
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-1" />
                )}
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="w-4 h-4" /> Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" /> Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-0">
            <InvoiceForm invoice={invoice} onChange={setInvoice} />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <div className="overflow-x-auto">
              <InvoicePreview ref={previewRef} invoice={invoice} calculations={calculations} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default function InternalInvoice() {
  return (
    <InvoicePasswordGate>
      <InvoiceGeneratorContent />
    </InvoicePasswordGate>
  );
}