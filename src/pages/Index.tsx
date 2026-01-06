import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <WhyChooseUs />
    </Layout>
  );
};

export default Index;
