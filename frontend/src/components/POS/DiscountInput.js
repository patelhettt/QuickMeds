import React from 'react';

/**
 * Discount input component for the POS system
 * Allows applying a discount to the order
 */
const DiscountInput = ({ discountAmount, setDiscountAmount, subtotal }) => (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-100 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <svg className="h-4 w-4 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="5" x2="5" y2="19"></line>
                <circle cx="6.5" cy="6.5" r="2.5"></circle>
                <circle cx="17.5" cy="17.5" r="2.5"></circle>
            </svg>
            Apply Discount
        </h3>
        <div className="flex">
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                </div>
                <input
                    type="number"
                    min="0"
                    max={subtotal}
                    step="0.01"
                    value={discountAmount}
                    onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value)) {
                            setDiscountAmount(0);
                        } else if (value > subtotal) {
                            setDiscountAmount(subtotal);
                        } else {
                            setDiscountAmount(value);
                        }
                    }}
                    className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="0.00"
                />
            </div>
            <button
                onClick={() => setDiscountAmount(0)}
                className="ml-2 px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
            >
                Clear
            </button>
        </div>
    </div>
);

export default DiscountInput; 