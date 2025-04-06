import React from 'react';
import { ShoppingBag, Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../pages/POSCart';

/**
 * Product card component for the POS system
 * Displays product information and allows adding to cart
 */
const ProductCard = ({ product, cart, addToCart }) => {
    const isInCart = cart.some(item => item._id === product._id);
    const stock = parseInt(product.stock || 0);
    const price = product.Unit_MRP || product.unitMrp || 0;
    const productName = product.tradeName || product.Product_name || 'Unknown Product';
    const category = product.category || product.Category || 'Unknown';
    const company = product.Company || product.company || '';

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const addedDate = formatDate(product.addedAt || product.createdAt || new Date().toISOString());

    // Determine stock status for styling
    const getStockStatus = () => {
        if (stock <= 0) return 'Out of Stock';
        if (stock <= 5) return 'Low Stock';
        return `${stock} in stock`;
    };

    const getStockColor = () => {
        if (stock <= 0) return 'bg-red-100 text-red-800';
        if (stock <= 5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1 mr-2">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                            {productName}
                        </h3>
                        <div className="flex flex-wrap gap-1 mb-2">
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                {category}
                            </span>
                            {company && (
                                <span className="inline-block bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded">
                                    {company}
                                </span>
                            )}
                        </div>
                    </div>
                    <span className="font-bold text-primary text-lg whitespace-nowrap">
                        {formatPrice(price)}
                    </span>
                </div>

                <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Added: {addedDate}</span>
                    </div>

                    <span className={`text-xs px-2 py-1 rounded-full ${getStockColor()}`}>
                        {getStockStatus()}
                    </span>
                </div>

                <button
                    onClick={() => addToCart(product)}
                    disabled={stock <= 0 || isInCart}
                    className={`mt-3 w-full py-1.5 rounded-md text-sm font-medium transition-colors ${stock <= 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isInCart
                                ? 'bg-green-50 text-green-600 border border-green-200'
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                >
                    {isInCart ? (
                        <div className="flex items-center justify-center">
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            In Cart
                        </div>
                    ) : stock <= 0 ? (
                        'Out of Stock'
                    ) : (
                        <div className="flex items-center justify-center">
                            <Plus className="h-4 w-4 mr-1" />
                            Add to Cart
                        </div>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;