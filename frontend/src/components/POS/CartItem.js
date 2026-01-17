import React, { useState } from 'react';
import { Minus, Plus, Trash2, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../pages/POSCart';
import { usePOSContext } from '../../pages/POSContext';

/**
 * Cart item component for the POS system
 * Displays an item in the cart with quantity controls
 */
const CartItem = ({ item }) => {
    const { updateCartItemQuantity, removeFromCart, updateItemDiscount } = usePOSContext();
    const [showDiscountOptions, setShowDiscountOptions] = useState(false);
    const [manualDiscount, setManualDiscount] = useState('');

    const discountOptions = [2, 5, 10, 15, 20, 40];

    const handleRemove = () => {
        removeFromCart(item._id);
    };

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            updateCartItemQuantity(item._id, newQuantity);
        }
    };

    const handleDiscountChange = (discount) => {
        updateItemDiscount(item._id, discount);
        setShowDiscountOptions(false);
    };

    const handleManualDiscount = () => {
        const discount = parseFloat(manualDiscount);
        if (!isNaN(discount) && discount >= 0 && discount <= 100) {
            updateItemDiscount(item._id, discount);
            setManualDiscount('');
            setShowDiscountOptions(false);
        }
    };

    const price = item.Unit_MRP || item.unitMrp || 0;
    const itemDiscount = item.discount || 0;
    const discountedPrice = price * (1 - itemDiscount / 100);
    const subtotal = discountedPrice * item.quantity;
    const productName = item.tradeName || item.Product_name || 'Unknown Product';
    const category = item.category || item.Category || 'Unknown';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 relative border border-gray-200 rounded-lg bg-white shadow-sm"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="pr-6 flex-1">
                    <h4 className="font-medium text-gray-900 text-base mb-1 line-clamp-1">
                        {productName}
                    </h4>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">{category}</span>
                        <span className="text-sm text-primary font-medium">
                            {formatPrice(price)}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>

            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4">
                    {/* Quantity Input */}
                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Quantity:</label>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={handleQuantityChange}
                            className="w-24 text-center border-gray-200 rounded-md py-1.5 px-2"
                            min="1"
                            max={item.stock || 999}
                        />
                    </div>

                    {/* Discount Button and Options */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDiscountOptions(!showDiscountOptions)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm ${
                                itemDiscount > 0
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Percent className="h-4 w-4" />
                            <span>{itemDiscount}%</span>
                        </button>

                        {showDiscountOptions && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md relative">
                                    <button
                                        onClick={() => setShowDiscountOptions(false)}
                                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                                    >
                                        &times;
                                    </button>
                                    <div className="font-bold text-lg mb-4 text-primary">Set Item Discount</div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Manual Discount</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={manualDiscount}
                                                onChange={e => setManualDiscount(e.target.value)}
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-primary"
                                                placeholder="Enter %"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                            />
                                            <button
                                                onClick={handleManualDiscount}
                                                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-700 mb-2">Quick Discount</div>
                                        <div className="flex flex-wrap gap-2">
                                            {discountOptions.map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleDiscountChange(option)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                        itemDiscount === option
                                                            ? 'bg-primary text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {option}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {itemDiscount > 0 && (
                                        <button
                                            onClick={() => handleDiscountChange(0)}
                                            className="w-full mt-4 text-sm text-red-500 hover:text-red-700 py-2 rounded-lg"
                                        >
                                            Clear Discount
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-right">
                    {itemDiscount > 0 && (
                        <div className="text-sm text-gray-500 line-through mb-1">
                            {formatPrice(price * item.quantity)}
                        </div>
                    )}
                    <div className="font-medium text-gray-900 text-lg">
                        {formatPrice(subtotal)}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem; 