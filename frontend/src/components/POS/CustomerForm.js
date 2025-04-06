import React from 'react';
import { User, Phone, Mail } from 'lucide-react';
import { usePOSContext } from '../../pages/POSContext';

/**
 * Customer form component for the POS system
 * Allows entering customer details for orders
 */
const CustomerForm = () => {
    const { customerInfo, setCustomerInfo } = usePOSContext();

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                    Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        placeholder="Customer name"
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="Phone number"
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email (Optional)
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        placeholder="Email address"
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerForm; 