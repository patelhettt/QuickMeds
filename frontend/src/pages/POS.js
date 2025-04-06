import React from 'react';
import { POSProvider, usePOSContext } from './POSContext';
import POSHeader from './POSHeader';
import POSProductList from './POSProductList';
import POSCart from './POSCart';
import OrderSuccess from '../components/POS/OrderSuccess';
import ErrorDisplay from '../components/POS/ErrorDisplay';
import LoadingDisplay from '../components/POS/LoadingDisplay';
import printReceipt from '../utils/printReceipt';

// Make printReceipt available globally for the context to use
window.printReceipt = printReceipt;

const POSContent = () => {
    const { 
        loading, 
        error, 
        orderSuccess, 
        orderDetails,
        handlePrintReceipt,
        createNewOrder,
        handleReload
    } = usePOSContext();

    if (loading) {
        return <LoadingDisplay />;
    }

    if (error) {
        return <ErrorDisplay error={error} reload={handleReload} />;
    }

    if (orderSuccess) {
        return (
            <OrderSuccess 
                orderDetails={orderDetails} 
                handlePrintReceipt={handlePrintReceipt} 
                createNewOrder={createNewOrder} 
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <POSHeader />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <POSProductList />
                    <POSCart />
                </div>
            </main>
        </div>
    );
};

const POS = () => {
    return (
        <POSProvider>
            <POSContent />
        </POSProvider>
    );
};

export default POS;