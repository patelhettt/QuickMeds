import React from 'react';
import { motion } from 'framer-motion';
import { Printer, Package } from 'lucide-react';

/**
 * Order success component for the POS system
 * Displayed after a successful order completion
 */
const OrderSuccess = ({ orderDetails, handlePrintReceipt, createNewOrder }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 m-4"
        >
            <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h2>
                <p className="text-gray-600 mb-6">
                    Your order #{orderDetails.order_id} has been processed successfully.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">{orderDetails.customer.name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium text-secondary">${orderDetails.payment.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">{orderDetails.payment.method.toUpperCase()}</span>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handlePrintReceipt}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Printer className="h-5 w-5" />
                        Print Receipt
                    </button>
                    <button
                        onClick={createNewOrder}
                        className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors"
                    >
                        <Package className="h-5 w-5" />
                        New Order
                    </button>
                </div>
            </div>
        </motion.div>
    </div>
);

export default OrderSuccess; 