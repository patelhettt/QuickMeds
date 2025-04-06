import React from 'react';
import { ShoppingCart, CreditCard, Wallet, Banknote } from 'lucide-react';
import { formatPrice } from '../../pages/POSCart';
import { usePOSContext } from '../../pages/POSContext';

/**
 * Order summary component for the POS system
 * Displays order totals and submit button
 */
const OrderSummary = ({ subtotal, total, onSubmit, isSubmitting, disabled, paymentMethod }) => {
    const { cartQuantity } = usePOSContext();
    
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
    
    return (
        <div>
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartQuantity} items)</span>
                    <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
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
                disabled={isSubmitting || disabled}
                className={`w-full flex items-center justify-center py-2.5 px-4 rounded-md text-white font-medium transition-all ${
                    isSubmitting || disabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/90'
                }`}
            >
                {isSubmitting ? (
                    <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white/90 rounded-full animate-spin mr-2"></div>
                        Processing...
                    </div>
                ) : (
                    <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Complete Sale ({formatPrice(total)})
                    </>
                )}
            </button>
        </div>
    );
};

export default OrderSummary; 