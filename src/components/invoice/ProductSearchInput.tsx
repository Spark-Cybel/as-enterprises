import { useState, useRef, useEffect } from 'react';
import { useAllProductsIncludingHidden, SanityProduct } from '@/hooks/useSanityData';
import { urlFor } from '@/sanity/client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Helper to highlight matching text
const highlightMatch = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) =>
    regex.test(part) ? (
      <strong key={i} className="font-bold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  );
};

interface ProductSearchInputProps {
  value: string;
  onProductSelect: (data: {
    name: string;
    hsn: string;
    rate: number;
    gstPercentage: number;
  }) => void;
  onCustomEntry: (name: string) => void;
  placeholder?: string;
}

export const ProductSearchInput = ({
  value,
  onProductSelect,
  onCustomEntry,
  placeholder = 'Search products...',
}: ProductSearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Use all products including hidden ones for invoice dropdown
  const { data: products = [], isLoading } = useAllProductsIncludingHidden();

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter products based on input (search by name or product code)
  const filteredProducts = inputValue.trim()
    ? products.filter((product) => {
        const searchTerm = inputValue.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const codeMatch = product.productCode?.toLowerCase().includes(searchTerm);
        return nameMatch || codeMatch;
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
        highlightedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelectProduct = (product: SanityProduct) => {
    setInputValue(product.name);
    setIsOpen(false);
    onProductSelect({
      name: product.name,
      hsn: product.productCode || '',
      rate: product.price || 0,
      gstPercentage: product.gstPercentage ?? 18,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(val.trim().length > 0);
    // When typing, just update the name field
    onCustomEntry(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredProducts.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredProducts[highlightedIndex]) {
          handleSelectProduct(filteredProducts[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleBlur = () => {
    // Delay closing to allow click on dropdown items
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleFocus = () => {
    if (inputValue.trim().length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        autoComplete="off"
      />
      
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover shadow-md"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading products...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No products found. Press Enter to use custom name.
            </div>
          ) : (
            <div ref={listRef} className="py-1">
              {filteredProducts.slice(0, 10).map((product, index) => (
                <div
                  key={product._id}
                  onClick={() => handleSelectProduct(product)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-accent',
                    index === highlightedIndex && 'bg-accent'
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
                      {highlightMatch(product.name, inputValue)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Code: {product.productCode ? highlightMatch(product.productCode, inputValue) : '—'}
                      </span>
                      <span className="font-medium text-foreground">
                        ₹{(product.price ?? 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length > 10 && (
                <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                  +{filteredProducts.length - 10} more results. Type to narrow down.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
