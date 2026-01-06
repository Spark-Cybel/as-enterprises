import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { SanityProduct } from "@/hooks/useSanityData";
import { urlFor } from "@/sanity/client";

interface ProductCardProps {
  product: Product | SanityProduct;
}

// Type guard to check if product is from Sanity
function isSanityProduct(product: Product | SanityProduct): product is SanityProduct {
  return '_id' in product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const imageUrl = isSanityProduct(product) && product.image
    ? urlFor(product.image).width(400).height(400).url()
    : 'image' in product && typeof product.image === 'string'
    ? product.image
    : '/placeholder.png';

  const id = isSanityProduct(product) ? product._id : product.id;

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 card-hover"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <Link 
          to={`/product-category/${product.categorySlug}`}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Category – {product.category}
        </Link>
        <h3 className="text-base font-semibold font-heading mt-1 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
      </div>
    </Link>
  );
};
