import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

/**
 * Product card component for the POS system
 * Displays product information and allows adding to cart
 */
const ProductCard = ({ 
    product, 
    cart, 
    approvedOrders, 
    addToCart 
}) => {
    // Find this product in approved orders to get approved quantity
    const getApprovedQuantity = () => {
        let totalApproved = 0;
        
        approvedOrders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    if (item.itemId === product._id) {
                        totalApproved += parseInt(item.quantity) || 0;
                    }
                });
            }
        });
        
        return totalApproved;
    };
    
    const approvedQty = getApprovedQuantity();
    const inStock = approvedQty > 0;
    const isInCart = cart.some(item => item._id === product._id);
    const cartItem = cart.find(item => item._id === product._id);
    const remainingApproved = cartItem 
        ? approvedQty - cartItem.quantity 
        : approvedQty;
    
    const handleAddToCart = () => {
        if (inStock) {
            addToCart(product, approvedQty);
        }
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all ${
                !inStock ? 'opacity-70' : ''
            }`}
        >
            <div className="p-4">
                <div className="flex items-baseline justify-between mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.type === 'pharmacy' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-secondary/10 text-secondary'
                    }`}>
                        {product.type === 'pharmacy' ? 'Pharmacy' : 'Non-Pharmacy'}
                    </span>
                    {!inStock && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Not Approved
                        </span>
                    )}
                </div>
                
                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                    {product.tradeName || product.Product_name}
                </h3>
                
                {product.genericName && (
                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                        {product.genericName}
                    </p>
                )}
                
                <div className="flex items-baseline justify-between mt-3">
                    <span className="text-lg font-bold text-primary">
                        ${((product.Unit_MRP || product.unitMrp || 0)).toFixed(2)}
                    </span>
                    <div className="text-sm flex flex-col items-end">
                        {approvedQty > 0 ? (
                            <span className="text-green-600 font-medium">
                                Approved: {approvedQty}
                            </span>
                        ) : (
                            <span className="text-gray-500">
                                Not approved
                            </span>
                        )}
                        {cartItem && (
                            <span className="text-blue-600 text-xs">
                                In cart: {cartItem.quantity} 
                                {remainingApproved > 0 ? ` (${remainingApproved} remaining)` : ''}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="px-4 pb-4">
                <button
                    onClick={handleAddToCart}
                    disabled={!inStock || (cartItem && cartItem.quantity >= approvedQty)}
                    className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                        inStock
                            ? cartItem && cartItem.quantity >= approvedQty
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : isInCart
                                    ? 'bg-secondary text-white hover:bg-secondary/90'
                                    : 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {isInCart 
                        ? remainingApproved > 0 ? 'Add More' : 'Max Approved' 
                        : 'Add to Cart'}
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;