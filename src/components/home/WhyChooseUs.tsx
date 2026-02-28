import { Truck, Award, Users, HeadphonesIcon, Shield, Clock, CheckCircle, Star, LucideIcon } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSanityData";
import { Skeleton } from "@/components/ui/skeleton";

// Icon mapping for dynamic icons from CMS
const iconMap: Record<string, LucideIcon> = {
  Award: Award,
  Truck: Truck,
  Users: Users,
  HeadphonesIcon: HeadphonesIcon,
  Headphones: HeadphonesIcon,
  Shield: Shield,
  Clock: Clock,
  CheckCircle: CheckCircle,
  Star: Star,
};

const defaultReasons = [
  {
    icon: Award,
    title: "Premium Quality Products",
    description: "Genuine products sourced from trusted brands with manufacturer warranty and quality assurance."
  },
  {
    icon: Truck,
    title: "Competitive Pricing",
    description: "Dealer-direct pricing means better rates without compromising on product authenticity."
  },
  {
    icon: CheckCircle,
    title: "100% Genuine Products",
    description: "Every product is sourced directly from authorized channels—no duplicates, no compromises."
  },
  {
    icon: Clock,
    title: "Reliable Delivery",
    description: "Pan-India delivery network ensuring your orders reach you on time, every time."
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Industry experience to help you choose the right products for your specific requirements."
  },
  {
    icon: HeadphonesIcon,
    title: "Customer-First Approach",
    description: "Personalized service and dedicated support for all your queries and requirements."
  }
];

export const WhyChooseUs = () => {
  const { data: settings, isLoading } = useSiteSettings();

  const title = settings?.whyChooseUsTitle || "Why Choose Us";
  const hasPoints = settings?.whyChooseUsPoints && settings.whyChooseUsPoints.length > 0;

  // Use CMS points if available, otherwise use defaults
  const reasons = hasPoints
    ? settings.whyChooseUsPoints.map((point) => ({
        icon: iconMap[point.icon] || Award,
        title: point.title,
        description: point.description,
      }))
    : defaultReasons;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Partner with a trusted supplier for genuine products, competitive pricing, and reliable service.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-6">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => (
              <div 
                key={index} 
                className="bg-card rounded-lg p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-300 card-hover"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <reason.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-heading mb-2">{reason.title}</h3>
                <p className="text-muted-foreground text-sm">{reason.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
