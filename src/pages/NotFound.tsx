import { useLocation, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-primary font-heading mb-4">404</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">Oops! Page not found</p>
          <p className="text-muted-foreground mb-8">
            The page "{location.pathname}" doesn't exist.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-primary hover:bg-lime-hover text-primary-foreground font-semibold px-8 py-3 rounded-md transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
