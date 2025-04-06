import React from 'react';
import { CreditCard } from 'lucide-react';

/**
 * Payment method selector component for the POS system
 * Allows selecting between different payment methods
 */
const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-100 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <CreditCard className="h-4 w-4 mr-2 text-primary" />
            Payment Method
        </h3>
        <div className="grid grid-cols-2 gap-3">
            {[
                { id: 'cash', label: 'Cash', icon: <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="2" y1="12" x2="22" y2="12"/></svg> },
                { id: 'card', label: 'Card', icon: <CreditCard className="h-5 w-5" /> },
            ].map(method => (
                <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                        paymentMethod === method.id
                            ? 'bg-primary/10 text-primary border-2 border-primary/30'
                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                    {method.icon}
                    {method.label}
                </button>
            ))}
        </div>
    </div>
);

export default PaymentMethodSelector; 