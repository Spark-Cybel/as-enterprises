import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useSiteSettings, useCategories } from "@/hooks/useSanityData";
import { urlFor } from "@/sanity/client";
import logo from "@/assets/logo.png";

export const Footer = () => {
  const { data: settings } = useSiteSettings();
  const { data: categories } = useCategories();

  const phone = settings?.phone || "+91 94212 09422";
  const email = settings?.email || "as.enterprises.hq@gmail.com";
  const address = settings?.address || "10/B3, Krushna Nagar Society, Erandawane, Pune, Maharashtra 411004.";
  const siteLogo = settings?.logo ? urlFor(settings.logo).width(200).url() : logo;

  // Use CMS categories or fallback to static list
  const categoryLinks = categories && categories.length > 0
    ? categories.slice(0, 5).map((cat) => ({
        name: cat.name,
        path: `/product-category/${cat.slug}`,
      }))
    : [
        { name: "Air Purifiers & Fresheners", path: "/product-category/air-purifiers-fresheners" },
        { name: "Cleaning Mops", path: "/product-category/cleaning-mop" },
        { name: "Tissue Paper & Napkins", path: "/product-category/tissue-paper-napkins" },
        { name: "Floor Cleaners", path: "/product-category/floor-cleaners" },
        { name: "Hand Dryers", path: "/product-category/hand-dryers" },
      ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* CTA Banner */}
      <div className="bg-primary py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-lg md:text-xl font-semibold text-primary-foreground font-heading">
            The Best In Cleaning Machinery & Equipments!
          </h3>
          <Link
            to="/contact-us"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-2 rounded-md font-semibold transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <Link to="/" className="block mb-4">
                <img 
                  src={siteLogo} 
                  alt="AS Enterprises" 
                  className="h-16 w-auto"
                />
              </Link>
              <p className="text-secondary-foreground/80 text-sm leading-relaxed">
                Your Trusted Partner in Cleaning & Hygiene Solutions. Authorized AQSA dealer providing genuine, premium quality cleaning products and housekeeping materials across India.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 font-heading">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { name: "Home", path: "/" },
                  { name: "About Us", path: "/about-us" },
                  { name: "Products", path: "/products" },
                  { name: "Our Clients", path: "/client" },
                  { name: "Contact Us", path: "/contact-us" },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4 font-heading">Product Categories</h4>
              <ul className="space-y-2">
                {categoryLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 font-heading">Contact Info</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-foreground/80 text-sm">
                    {address}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                    {phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <a href={`mailto:${email}`} className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm">
                    {email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-secondary-foreground/10 py-4">
        <div className="container mx-auto px-4 text-center text-secondary-foreground/60 text-sm">
          © {new Date().getFullYear()} AS Enterprises. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
