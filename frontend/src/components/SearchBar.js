import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const SearchBar = ({ value, onChange, placeholder = "Search products..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [localValue, onChange, value]);

  return (
    <div className={`relative transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/30' : ''}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className={`transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none transition-all duration-300"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {localValue && (
        <button 
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
        >
          <span className="text-xs font-medium">Clear</span>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
