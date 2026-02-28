import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { CheckCircle } from "lucide-react";

const values = [
  "Ethical Business Practices",
  "Transparent Dealings",
  "Customer Satisfaction Focus",
  "Quality Assurance",
  "Timely Delivery",
  "Competitive Pricing"
];

const AboutUs = () => {
  return (
    <Layout>
      <PageHero 
        title="About Us" 
        backgroundImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80"
      />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-foreground">
              AS ENTERPRISES
            </h2>
            <p className="text-muted-foreground mt-2">
              Your Trusted Partner in Cleaning & Hygiene Solutions
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                AS Enterprises was founded in 2025 with a clear mission: to provide businesses across India with genuine, high-quality cleaning and hygiene products at competitive prices. We partner with trusted brands to bring you premium products, backed by our commitment to authenticity and customer satisfaction.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                With hands-on experience in the cleaning and hygiene industry, we understand what businesses truly need—reliable products, transparent pricing, and a partner who delivers on promises. Our extensive network of industry connections allows us to offer a comprehensive range of over 2000 products, ensuring you find exactly what you need for your facility management requirements. We believe that trust is earned through actions, not years.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-8">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="AS Enterprises Office"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg hidden md:block">
                <div className="text-4xl font-bold font-heading">2000+</div>
                <div className="text-sm">Quality Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
              Why Choose Us
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-muted-foreground leading-relaxed mb-6 text-center">
              We offer a comprehensive range of cleaning solutions including laundry care, room care, kitchen care, housekeeping supplies, industrial care products, toilet cleaners, surface cleaners, glass and marble cleaners, air fresheners, and deodorizers—all genuine, all quality-certified.
            </p>
            
            <p className="text-muted-foreground leading-relaxed text-center">
              Our edge lies in direct dealer access, which translates to competitive pricing and guaranteed authenticity. We pride ourselves on transparent dealings, efficient service, and building long-term partnerships with our clients. Your satisfaction is our business.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
