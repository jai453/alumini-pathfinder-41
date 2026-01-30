import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}

export function MultiSelect({ 
  options, 
  selected, 
  onChange, 
  placeholder = 'Select options...',
  allowCustom = true 
}: MultiSelectProps) {
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const addCustom = () => {
    if (customValue.trim() && !selected.includes(customValue.trim())) {
      onChange([...selected, customValue.trim()]);
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  const removeSelected = (option: string) => {
    onChange(selected.filter(s => s !== option));
  };

  return (
    <div className="space-y-3">
      {/* Selected items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <Badge 
              key={item} 
              variant="secondary" 
              className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
            >
              {item}
              <button
                type="button"
                onClick={() => removeSelected(item)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Options grid */}
      <div className="flex flex-wrap gap-2">
        {options.filter(o => !selected.includes(o)).map((option) => (
          <Button
            key={option}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toggleOption(option)}
            className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Plus className="h-3 w-3 mr-1" />
            {option}
          </Button>
        ))}
      </div>

      {/* Custom input */}
      {allowCustom && (
        <div className="pt-2">
          {showCustomInput ? (
            <div className="flex gap-2">
              <Input
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Enter custom option..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
              />
              <Button type="button" size="sm" onClick={addCustom}>
                Add
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowCustomInput(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomInput(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add custom option
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
