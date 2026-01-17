import React, { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Check, X } from 'lucide-react';

const PaymentModal = ({ total, onComplete, onClose }) => {
    const [selectedMethod, setSelectedMethod] = useState('cash');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods = [
        {
            id: 'cash',
            name: 'Cash Payment',
            icon: <Wallet className="h-6 w-6" />,
            description: 'Pay with cash at counter'
        },
        {
            id: 'upi',
            name: 'UPI Payment',
            icon: <Smartphone className="h-6 w-6" />,
            description: 'Pay using any UPI app'
        },
        {
            id: 'razorpay',
            name: 'Card Payment',
            icon: <CreditCard className="h-6 w-6" />,
            description: 'Pay using credit/debit card'
        }
    ];

    const handlePayment = async () => {
        setIsProcessing(true);
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        onComplete(selectedMethod);
        setIsProcessing(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Select Payment Method
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedMethod === method.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`${
                                    selectedMethod === method.id ? 'text-primary' : 'text-gray-400'
                                }`}>
                                    {method.icon}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                                    <p className="text-sm text-gray-500">{method.description}</p>
                                </div>
                                {selectedMethod === method.id && (
                                    <Check className="h-5 w-5 text-primary ml-auto" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="text-xl font-bold text-primary">₹{total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-all ${
                            isProcessing
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary/90'
                        }`}
                    >
                        {isProcessing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Processing...</span>
                            </div>
                        ) : (
                            `Pay ₹${total.toFixed(2)}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal; 