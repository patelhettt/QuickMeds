import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Cart item component for the POS system
 * Displays an item in the cart with quantity controls
 */
const CartItem = ({ 
    item, 
    updateCartItemQuantity, 
    removeFromCart 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editQuantity, setEditQuantity] = useState(item.quantity);
    
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setEditQuantity(value);
        }
    };
    
    const saveQuantity = () => {
        updateCartItemQuantity(item._id, editQuantity);
        setIsEditing(false);
    };
    
    const handleRemove = () => {
        removeFromCart(item._id);
    };
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-3 mb-3 border border-gray-100 shadow-sm"
        >
            <div className="flex justify-between">
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                        {item.tradeName || item.Product_name}
                    </h3>
                    <div className="text-sm text-primary font-semibold mt-1">
                        ${(item.Unit_MRP || item.unitMrp).toFixed(2)} each
                    </div>
                </div>
                
                <button
                    onClick={handleRemove}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border rounded-md overflow-hidden border-primary/20">
                    {isEditing ? (
                        <div className="flex">
                            <input
                                type="number"
                                value={editQuantity}
                                onChange={handleQuantityChange}
                                min="1"
                                max={item.approvedQty}
                                className="w-12 py-1 px-2 text-center border-none focus:ring-0"
                                autoFocus
                                onBlur={saveQuantity}
                                onKeyDown={(e) => e.key === 'Enter' && saveQuantity()}
                            />
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                -
                            </button>
                            <div 
                                className="px-3 py-1 select-none cursor-pointer" 
                                onClick={() => {
                                    setEditQuantity(item.quantity);
                                    setIsEditing(true);
                                }}
                            >
                                {item.quantity}
                            </div>
                            <button
                                onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                +
                            </button>
                        </>
                    )}
                </div>
                
                <div className="font-medium text-secondary">
                    ${((item.Unit_MRP || item.unitMrp) * item.quantity).toFixed(2)}
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem; 