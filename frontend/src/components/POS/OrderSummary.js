import React, { useState } from 'react';
import { ShoppingCart, CreditCard, Wallet, Banknote, Percent } from 'lucide-react';
import { formatPrice } from '../../pages/POSCart';
import { usePOSContext } from '../../pages/POSContext';

/**
 * Order summary component for the POS system
 * Displays order totals and submit button
 */
const OrderSummary = ({ subtotal, total, onSubmit, isSubmitting, disabled, paymentMethod }) => {
    const { cartQuantity, discount, applyDiscount, clearDiscount, cart } = usePOSContext();
    const [manualDiscount, setManualDiscount] = useState('');
    const [showDiscountOptions, setShowDiscountOptions] = useState(false);
    
    const discountOptions = [2, 5, 10, 15, 20, 40];

    // Get payment method icon
    const getPaymentIcon = () => {
        switch(paymentMethod) {
            case 'card': return <CreditCard className="h-4 w-4 mr-2" />;
            case 'upi': return <Wallet className="h-4 w-4 mr-2" />;
            case 'cash':
            default: return <Banknote className="h-4 w-4 mr-2" />;
        }
    };
    
    // Get payment method name
    const getPaymentMethodName = () => {
        switch(paymentMethod) {
            case 'card': return 'Card';
            case 'upi': return 'UPI';
            case 'cash':
            default: return 'Cash';
        }
    };
    
    const handleManualDiscount = () => {
        const discountValue = parseFloat(manualDiscount);
        if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
            applyDiscount(discountValue);
            setManualDiscount('');
            setShowDiscountOptions(false);
        }
    };

    const hasItemDiscount = cart.some(item => item.discount && item.discount > 0);
    const canApplyCartDiscount = !hasItemDiscount;
    const canApplyItemDiscount = discount === 0;

    return (
        <div>
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartQuantity} items)</span>
                    <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                </div>

                {/* Discount Section */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                    <div className="font-semibold text-gray-700 mb-2">Cart Discount</div>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="number"
                            value={manualDiscount}
                            onChange={(e) => setManualDiscount(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-primary"
                            placeholder="Enter %"
                            min="0"
                            max="100"
                            step="0.1"
                        />
                        <button
                            onClick={handleManualDiscount}
                            disabled={!canApplyCartDiscount}
                            className={`px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition ${!canApplyCartDiscount ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Apply
                        </button>
                    </div>
                    {!canApplyCartDiscount && (
                        <div className="text-xs text-red-500 mt-1">
                            Cart discount is disabled because an item discount is applied.
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {discountOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => applyDiscount(option)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    discount === option
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {option}%
                            </button>
                        ))}
                    </div>
                    {discount > 0 && (
                        <button
                            onClick={clearDiscount}
                            className="w-full mt-4 text-sm text-red-500 hover:text-red-700 py-2 rounded-lg"
                        >
                            Clear Discount
                        </button>
                    )}
                </div>
                
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-800 flex items-center">
                        {getPaymentIcon()}
                        {getPaymentMethodName()}
                    </span>
                </div>
                
                <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                        <span className="text-gray-800">Total</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                </div>
            </div>
            
            <button
                onClick={onSubmit}
                disabled={disabled || isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center"
            >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Processing...' : `Complete Sale (${formatPrice(total)})`}
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
                        <div className="font-bold text-lg mb-4 text-primary">Set Cart Discount</div>
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
                                        onClick={() => applyDiscount(option)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                            discount === option
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {option}%
                                    </button>
                                ))}
                            </div>
                        </div>
                        {discount > 0 && (
                            <button
                                onClick={clearDiscount}
                                className="w-full mt-4 text-sm text-red-500 hover:text-red-700 py-2 rounded-lg"
                            >
                                Clear Discount
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderSummary; 