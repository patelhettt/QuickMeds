import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Search bar component for the POS system
 * Allows searching for products
 */
const SearchBar = ({ value, onChange }) => (
    <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="block w-full rounded-lg pl-10 pr-3 py-3 bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200"
            placeholder="Search products by name, code or category..."
        />
        {value && (
            <button
                onClick={() => onChange('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
                <X className="h-5 w-5" aria-hidden="true" />
            </button>
        )}
    </div>
);

export default SearchBar; 