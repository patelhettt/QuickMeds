import React from 'react';
import { User } from 'lucide-react';

/**
 * Customer information form component for the POS system
 * Allows entering and displaying customer details
 */
const CustomerInfoForm = ({ 
    customerInfo, 
    setCustomerInfo, 
    showCustomerForm, 
    setShowCustomerForm 
}) => (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 flex items-center">
                <User className="h-4 w-4 mr-2 text-primary" />
                Customer Information
            </h3>
            <button
                onClick={() => setShowCustomerForm(!showCustomerForm)}
                className="text-sm text-primary hover:text-secondary"
            >
                {showCustomerForm ? 'Hide' : 'Edit'}
            </button>
        </div>
        
        {showCustomerForm ? (
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                    </label>
                    <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
            </div>
        ) : (
            <div className="text-sm text-gray-600">
                <div className="flex items-center mb-1">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    {customerInfo.name || 'Walk-in Customer'}
                </div>
                {customerInfo.phone && (
                    <div className="flex items-center mb-1">
                        <svg className="h-4 w-4 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        {customerInfo.phone}
                    </div>
                )}
                {customerInfo.email && (
                    <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        {customerInfo.email}
                    </div>
                )}
            </div>
        )}
    </div>
);

export default CustomerInfoForm; 