import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../pages/POSCart';
import { usePOSContext } from '../../pages/POSContext';

/**
 * Cart item component for the POS system
 * Displays an item in the cart with quantity controls
 */
const CartItem = ({ item }) => {
    const { updateCartItemQuantity, removeFromCart } = usePOSContext();

    const handleRemove = () => {
        removeFromCart(item._id);
    };

    const price = item.Unit_MRP || item.unitMrp || 0;
    const subtotal = price * item.quantity;
    const productName = item.tradeName || item.Product_name || 'Unknown Product';
    const category = item.category || item.Category || 'Unknown';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 relative"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="pr-6">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{productName}</h4>
                    <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">{category}</span>
                        <span className="text-xs text-primary font-medium">{formatPrice(price)}</span>
                    </div>
                </div>
                <button
                    onClick={handleRemove}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                    <button
                        onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                        className="bg-gray-100 hover:bg-gray-200 rounded-md p-1 text-gray-600"
                    >
                        <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span className="mx-2 text-center text-sm font-medium w-6">{item.quantity}</span>

                    <button
                        onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                        className="bg-gray-100 hover:bg-gray-200 rounded-md p-1 text-gray-600"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="text-right">
                    <div className="font-medium text-gray-900">
                        {formatPrice(subtotal)}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem; 