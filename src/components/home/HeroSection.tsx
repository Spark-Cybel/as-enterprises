import { Link } from "react-router-dom";
import { CheckCircle, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSanityData";
import { urlFor } from "@/sanity/client";

const features = [
  { icon: CheckCircle, text: "100% Genuine Products" },
  { icon: Shield, text: "Authorized AQSA Dealer" },
  { icon: Clock, text: "Competitive Dealer Pricing" },
];

export const HeroSection = () => {
  const { data: settings } = useSiteSettings();

  const heroTitle = settings?.heroTitle || "Your Trusted Partner in Cleaning & Hygiene Solutions";
  const heroSubtitle = settings?.heroSubtitle;
  const heroImage = settings?.heroImage
    ? urlFor(settings.heroImage).width(1920).url()
    : "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1920&q=80";

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] bg-secondary overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${heroImage}')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary/50" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-2xl">
          <p className="text-secondary-foreground/80 text-sm md:text-base mb-2 animate-fade-in">
            Welcome to AS Enterprises
          </p>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground font-heading leading-tight mb-6 animate-slide-up">
            {heroTitle}
          </h1>
          
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 text-secondary-foreground animate-fade-in"
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                <feature.icon className="h-5 w-5 text-primary" />
                <span className="text-sm md:text-base">{feature.text}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              asChild 
              size="lg" 
              className="bg-primary hover:bg-lime-hover text-primary-foreground font-semibold"
            >
              <Link to="/contact-us">Get a Quote</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
            >
              <Link to="/products">View Products</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats Bar */}
      <div className="absolute bottom-0 right-0 left-0 md:left-auto md:right-8 lg:right-16 md:bottom-8">
        <div className="bg-secondary/95 backdrop-blur-sm rounded-t-lg md:rounded-lg p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { value: "AQSA", label: "Authorized Dealer" },
              { value: "2000+", label: "Products" },
              { value: "100%", label: "Genuine Quality" },
              { value: "Pan-India", label: "Delivery" },
            ].map((stat, index) => (
              <div key={index} className="animate-count" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-2xl md:text-3xl font-bold text-primary font-heading">{stat.value}</div>
                <div className="text-xs md:text-sm text-secondary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
