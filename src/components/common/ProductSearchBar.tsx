import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProducts, SanityProduct } from "@/hooks/useSanityData";
import { urlFor } from "@/sanity/client";
import { cn } from "@/lib/utils";

// Helper to highlight matching text
const highlightMatch = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <strong key={i} className="font-bold">
        {part}
      </strong>
    ) : (
      part
    )
  );
};

interface ProductSearchBarProps {
  onClose?: () => void;
  className?: string;
  /** "inline" shows full search input, "button" shows icon that opens sheet */
  variant?: "inline" | "button";
}

export const ProductSearchBar = ({
  onClose,
  className,
  variant = "inline",
}: ProductSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();

  // Filter products based on search term
  const filteredProducts = searchTerm.trim()
    ? products.filter((product) => {
        const term = searchTerm.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(term);
        const codeMatch = product.productCode?.toLowerCase().includes(term);
        const categoryMatch = product.category?.toLowerCase().includes(term);
        return nameMatch || codeMatch || categoryMatch;
      })
    : [];

  // Reset highlighted index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredProducts.length]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const highlightedItem = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProduct = useCallback(
    (product: SanityProduct) => {
      setSearchTerm("");
      setIsOpen(false);
      onClose?.();
      navigate(`/product/${product.slug}`);
    },
    [navigate, onClose]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsOpen(val.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredProducts.length === 0) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredProducts[highlightedIndex]) {
          handleSelectProduct(filteredProducts[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        break;
    }
  };

  const handleFocus = () => {
    if (searchTerm.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Product result item component
  const ProductResultItem = ({
    product,
    index,
  }: {
    product: SanityProduct;
    index: number;
  }) => (
    <div
      onClick={() => handleSelectProduct(product)}
      className={cn(
        "flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-accent",
        index === highlightedIndex && "bg-accent"
      )}
    >
      {/* Product Image */}
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-muted">
        {product.image ? (
          <img
            src={urlFor(product.image).width(80).height(80).url()}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No img
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-medium">
          {highlightMatch(product.name, searchTerm)}
        </div>
        <div className="text-xs text-muted-foreground">
          {product.category}
        </div>
      </div>
    </div>
  );

  // Results dropdown content
  const ResultsContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading products...
          </span>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="py-4 text-center text-sm text-muted-foreground">
          No products found for "{searchTerm}"
        </div>
      );
    }

    return (
      <div ref={listRef} className="py-1">
        {filteredProducts.slice(0, 10).map((product, index) => (
          <ProductResultItem key={product._id} product={product} index={index} />
        ))}
        {filteredProducts.length > 10 && (
          <div className="px-3 py-2 text-xs text-muted-foreground text-center">
            +{filteredProducts.length - 10} more results. Type to narrow down.
          </div>
        )}
      </div>
    );
  };

  // Button variant: Expandable search on hover with dropdown results
  if (variant === "button") {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative flex items-center",
          className
        )}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => {
          // Only collapse if not focused and no search term
          if (!searchTerm.trim() && document.activeElement !== inputRef.current) {
            setIsOpen(false);
          }
        }}
      >
        <div
          className={cn(
            "flex items-center transition-all duration-300 ease-in-out overflow-hidden rounded-md border bg-muted/50",
            isOpen ? "w-[280px]" : "w-10"
          )}
        >
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // Delay to allow clicking on results
              setTimeout(() => {
                if (!searchTerm.trim()) {
                  setIsOpen(false);
                }
              }, 200);
            }}
            placeholder="Search products..."
            className={cn(
              "border-0 bg-transparent h-10 pl-0 pr-8 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300",
              isOpen ? "w-full opacity-100" : "w-0 opacity-0"
            )}
            autoComplete="off"
          />
          {searchTerm && isOpen && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown results */}
        {isOpen && searchTerm.trim().length > 0 && (
          <div className="absolute top-full right-0 z-50 mt-1 w-[320px] max-h-60 overflow-auto rounded-md border bg-popover shadow-md">
            <ResultsContent />
          </div>
        )}
      </div>
    );
  }

  // Inline variant: Full search input with dropdown results
  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Search products..."
          className="pl-9 pr-9 h-10 bg-muted/50 border-muted focus-visible:ring-primary"
          autoComplete="off"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && searchTerm.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover shadow-md">
          <ResultsContent />
        </div>
      )}
    </div>
  );
};
