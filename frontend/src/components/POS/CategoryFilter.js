import React from 'react';
import { Package, Scan, ShoppingCart } from 'lucide-react';

/**
 * Category filter component for the POS system
 * Allows filtering products by category
 */
const CategoryFilter = ({ activeCategory, setActiveCategory }) => (
    <div className="flex overflow-x-auto pb-3 mb-6 gap-2 no-scrollbar">
        {[
            { id: 'all', label: 'All Products', icon: <Package className="h-4 w-4" /> },
            { id: 'pharmacy', label: 'Pharmacy Items', icon: <Scan className="h-4 w-4" /> },
            { id: 'nonPharmacy', label: 'Non-Pharmacy', icon: <ShoppingCart className="h-4 w-4" /> },
        ].map(category => (
            <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                {category.icon}
                {category.label}
            </button>
        ))}
    </div>
);

export default CategoryFilter; 