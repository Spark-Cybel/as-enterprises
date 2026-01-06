import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, User, Loader2, Package, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.union([z.string().min(10, "Please enter a valid phone number"), z.literal("")]),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to receive communications",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ProductContext {
  id: string;
  name: string;
  category: string;
}

interface LocationState {
  product?: ProductContext;
}

const ContactUs = () => {
  const { toast } = useToast();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [productContext, setProductContext] = useState<ProductContext | null>(
    state?.product || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: productContext 
        ? `I am interested in: ${productContext.name} (${productContext.category})\n\n` 
        : "",
      consent: false,
    },
  });

  const handleSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    const submissionTime = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          enquirer_name: data.name,
          enquirer_email: data.email,
          enquirer_phone: data.phone,
          enquiry: data.message,
          product_id: productContext?.id || "N/A",
          product_name: productContext?.name || "General Inquiry",
          product_category: productContext?.category || "N/A",
          submission_time: submissionTime,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      
      form.reset();
      setProductContext(null);
    } catch (error) {
      console.error("EmailJS error:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly via phone or email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearProductContext = () => {
    setProductContext(null);
    // Clear the pre-filled message if it contains product info
    const currentMessage = form.getValues("message");
    if (currentMessage.startsWith("I am interested in:")) {
      form.setValue("message", "");
    }
  };

  return (
    <Layout>
      <PageHero 
        title="Contact Us" 
        backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
      />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground uppercase">
              Get In Touch With Us
            </h2>
            <p className="text-muted-foreground mt-2">
              Fill the form below with your queries
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card rounded-lg p-6 md:p-8 shadow-card">
              {/* Product Context Badge */}
              {productContext && (
                <div className="mb-6 p-3 bg-primary/10 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      Inquiry about: <span className="text-primary">{productContext.name}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearProductContext}
                    className="p-1 hover:bg-primary/20 rounded-full transition-colors"
                    aria-label="Remove product context"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">
                          Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">
                          Email Address <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="email" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">
                          Contact Number
                        </FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">
                          Your Message <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-muted-foreground font-normal">
                            I authorize AS Enterprises to send notification via SMS/RCS/Whatsapp/Email.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-lime-hover text-primary-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
            
            {/* Contact Information */}
            <div className="bg-secondary rounded-lg p-6 md:p-8 text-secondary-foreground">
              <h3 className="text-xl font-semibold font-heading mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <User className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span>Mr. Indranil Bhosale</span>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span>
                    10/B3, Krushna Nagar Society, Erandawane, Pune, Maharashtra 411004.
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="tel:+919421209422" className="hover:text-primary transition-colors">
                    +91 94212 09422
                  </a>
                </div>
                
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href="mailto:as.enterprises.hq@gmail.com" className="hover:text-primary transition-colors">
                    as.enterprises.hq@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactUs;
