import React from 'react';
import { User, Phone, Mail, X } from 'lucide-react';

const CustomerDetailsForm = ({ customerInfo, setCustomerInfo, onClose }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Customer Details
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Customer Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                    className="pl-10 w-full border-gray-200 rounded-md"
                                    placeholder="Enter customer name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number (Optional)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                    className="pl-10 w-full border-gray-200 rounded-md"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email (Optional)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={customerInfo.email}
                                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                                    className="pl-10 w-full border-gray-200 rounded-md"
                                    placeholder="Enter email address"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Continue to Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerDetailsForm; 