import React from 'react';
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

    return (
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-2rem)] flex flex-col">
            {/* Cart Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                    <h2 className="font-medium text-gray-800 flex items-center">
                        <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                        Your Cart
                        {hasItems && (
                            <span className="ml-2 badge badge-primary">
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
            <div className="flex-1 overflow-auto">
                {!hasItems ? (
                    <EmptyCart triggerRefresh={error ? handleReload : null} />
                ) : (
                    <div className="divide-y divide-gray-100">
                        <AnimatePresence>
                            {cart.map(item => (
                                <CartItem key={item._id} item={item} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Customer Info */}
            {hasItems && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    {showCustomerForm ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-gray-800">Customer Details</h3>
                                <button 
                                    onClick={() => setShowCustomerForm(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <CustomerForm />
                        </motion.div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    {customerInfo.name}
                                </p>
                                {customerInfo.phone && (
                                    <p className="text-xs text-gray-500">{customerInfo.phone}</p>
                                )}
                            </div>
                            <button 
                                onClick={() => setShowCustomerForm(true)}
                                className="text-xs text-primary hover:text-primary/80"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Order Summary and Checkout */}
            {hasItems && (
                <div className="p-4 border-t border-gray-200">
                    {/* Payment Method Selector */}
                    <PaymentOptions 
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />
                
                    <OrderSummary 
                        subtotal={subtotal} 
                        total={totalAmount}
                        onSubmit={submitOrder}
                        isSubmitting={isSubmitting}
                        disabled={loading}
                        paymentMethod={paymentMethod}
                    />
                </div>
            )}
        </div>
    );
};

export default POSCart; 