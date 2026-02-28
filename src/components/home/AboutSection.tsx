import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSanityData";
import { PortableText } from "@portabletext/react";

export const AboutSection = () => {
  const { data: settings, isLoading } = useSiteSettings();

  const aboutTitle = settings?.aboutTitle || "About AS Enterprises";
  const hasAboutContent = settings?.aboutContent && settings.aboutContent.length > 0;

  // Default content if no CMS content
  const defaultContent = (
    <>
      <p className="text-muted-foreground leading-relaxed mb-6">
        AS Enterprises is your trusted cleaning solutions partner, bringing you premium cleaning and hygiene products backed by industry expertise. With an extensive network of quality suppliers, we ensure you receive only certified, quality-tested products at competitive prices.
      </p>
      
      <p className="text-muted-foreground leading-relaxed mb-8">
        Our commitment is simple: deliver genuine products, maintain transparent pricing, and provide reliable service. Whether you're managing a corporate office, hotel, hospital, or retail space, we have the right cleaning solutions for your needs. Experience the difference of working with a trusted partner who prioritizes your satisfaction.
      </p>
    </>
  );

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading text-foreground">{aboutTitle}</h2>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          {hasAboutContent ? (
            <div className="text-muted-foreground leading-relaxed mb-8 prose prose-gray max-w-none">
              <PortableText value={settings.aboutContent} />
            </div>
          ) : (
            defaultContent
          )}
          
          <Button asChild className="bg-primary hover:bg-lime-hover text-primary-foreground">
            <Link to="/about-us">About Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
