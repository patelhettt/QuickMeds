import React, { useState } from 'react';
import { ShoppingBag, ShoppingBasket, Ban, X, CreditCard, Wallet, Banknote } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePOSContext } from './POSContext';
import CartItem from '../components/POS/CartItem';
import OrderSummary from '../components/POS/OrderSummary';
import CustomerForm from '../components/POS/CustomerForm';

// Export the format price function to be used by other components
export const formatPrice = (price) => {
    const amount = parseFloat(price);
    if (isNaN(amount)) return '₹0';
    return `₹${amount.toFixed(2)}`;
};

const EmptyCart = ({ triggerRefresh }) => (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBasket className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-gray-800 font-medium text-lg mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-6 max-w-xs">
            Add items from the product catalog to create an order
        </p>
        {triggerRefresh && (
            <button
                onClick={triggerRefresh}
                className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-md text-sm font-medium"
            >
                Refresh Catalog
            </button>
        )}
    </div>
);

// Payment method selector component
const PaymentOptions = ({ paymentMethod, setPaymentMethod }) => {
    const options = [
        { id: 'cash', label: 'Cash', icon: <Banknote className="h-4 w-4 mr-2" /> },
        { id: 'card', label: 'Card', icon: <CreditCard className="h-4 w-4 mr-2" /> },
        { id: 'upi', label: 'UPI', icon: <Wallet className="h-4 w-4 mr-2" /> }
    ];
    
    return (
        <div className="mt-4 mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
                {options.map(option => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethod(option.id)}
                        className={`flex items-center justify-center px-3 py-2 border rounded-md text-sm font-medium ${
                            paymentMethod === option.id
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const POSCart = () => {
    const {
        cart,
        clearCart,
        submitOrder,
        isSubmitting,
        loading,
        error,
        customerInfo,
        setCustomerInfo,
        showCustomerForm,
        setShowCustomerForm,
        cartQuantity,
        subtotal,
        totalAmount,
        handleReload,
        paymentMethod,
        setPaymentMethod
    } = usePOSContext();

    const hasItems = cart.length > 0;
    const [errors, setErrors] = useState({});

    // Validation function
    const validateCustomer = () => {
        const newErrors = {};
        if (!customerInfo.name.trim()) newErrors.name = "Name is required";
        if (!customerInfo.phone.trim()) newErrors.phone = "Phone is required";
        return newErrors;
    };

    const handleProceedToPayment = () => {
        const validationErrors = validateCustomer();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        setShowCustomerForm(true);
    };

    return (
        <div className="w-full max-w-xl bg-white rounded-lg border border-gray-200 shadow-sm h-[calc(100vh-2rem)] flex flex-col ml-auto">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
                    <ShoppingBag className="h-7 w-7 mr-2" />
                    Your Cart
                </h2>
                {/* Cart Header */}
                <div className="flex justify-between items-center h-3/6">
                    <h2 className="font-medium text-gray-800 flex items-center text-lg">
                        <ShoppingBag className="h-6 w-6 mr-2 text-primary" />
                        Your Cart
                        {hasItems && (
                            <span className="ml-2 badge badge-primary text-sm">
                                {cartQuantity}
                            </span>
                        )}
                    </h2>
                    {hasItems && (
                        <button
                            onClick={clearCart}
                            className="text-sm text-red-500 hover:text-red-700 flex items-center"
                        >
                            <Ban className="h-4 w-4 mr-1" />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Cart Content */}
            <div className="flex-1 min-h-[400px] overflow-y-auto p-4 space-y-4">
                {hasItems ? (
                    cart.map((item) => (
                        <CartItem key={item._id} item={item} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                        <ShoppingBasket className="h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-xl text-gray-400 font-semibold">Your cart is empty</p>
                    </div>
                )}
            </div>

            {/* Customer Details and Order Summary */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className={`w-full border-gray-200 rounded-md px-3 py-2 text-sm ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Enter customer name"
                        required
                    />
                    {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className={`w-full border-gray-200 rounded-md px-3 py-2 text-sm ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="Enter phone number"
                        required
                    />
                    {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={customerInfo.email}
                        onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full border-gray-200 rounded-md px-3 py-2 text-sm"
                        placeholder="Enter email (optional)"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <textarea
                        value={customerInfo.address}
                        onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        className="w-full border-gray-200 rounded-md px-3 py-2 text-sm"
                        placeholder="Enter address (optional)"
                        rows={2}
                    />
                </div>
                {/* Order Summary */}
                <OrderSummary
                    subtotal={subtotal}
                    total={totalAmount}
                    onSubmit={submitOrder}
                    isSubmitting={isSubmitting}
                    disabled={!hasItems}
                />
            </div>
        </div>
    );
};

export default POSCart; 