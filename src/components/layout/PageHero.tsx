interface PageHeroProps {
  title: string;
  backgroundImage?: string;
}

export const PageHero = ({ title, backgroundImage }: PageHeroProps) => {
  return (
    <section 
      className="page-hero"
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      <div className="absolute inset-0 bg-secondary/85" />
      <div className="page-hero-content">
        <h1 className="page-hero-title">{title}</h1>
      </div>
    </section>
  );
};
