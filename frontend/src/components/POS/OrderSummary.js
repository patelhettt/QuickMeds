import React from 'react';

/**
 * Order summary component for the POS system
 * Displays order totals and summary information
 */
const OrderSummary = ({ cartQuantity, subtotal, discountAmount, totalAmount }) => (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-100 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <svg className="h-4 w-4 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Order Summary
        </h3>
        <div className="space-y-3">
            <div className="flex justify-between">
                <span className="text-gray-600">Items:</span>
                <span className="font-medium">{cartQuantity}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                </div>
            )}
            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-secondary">${totalAmount.toFixed(2)}</span>
            </div>
        </div>
    </div>
);

export default OrderSummary; 