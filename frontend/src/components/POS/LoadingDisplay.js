import React from 'react';
import { FaStore } from 'react-icons/fa';

/**
 * Loading display component for the POS system
 * Shown while products are being fetched
 */
const LoadingDisplay = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
                <FaStore className="w-full h-full text-primary animate-pulse" />
            </div>
            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4 mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Store</h2>
            <p className="text-gray-600">Please wait while we load your store data...</p>
        </div>
    </div>
);

export default LoadingDisplay; 