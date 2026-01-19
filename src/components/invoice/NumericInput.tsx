import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  placeholder?: string;
}

export const NumericInput = ({
  value,
  onChange,
  min,
  max,
  step = 0.01,
  className,
  placeholder,
}: NumericInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  // Sync display value when external value changes (and not focused)
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value.toString());
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // Update the actual value
    if (inputValue === '') {
      onChange(0);
    } else {
      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Show empty if value is 0 when focusing
    if (value === 0) {
      setDisplayValue('');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Always show the actual value on blur
    setDisplayValue(value.toString());
  };

  return (
    <Input
      type="number"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      min={min}
      max={max}
      step={step}
      className={cn(className)}
      placeholder={placeholder}
    />
  );
};
