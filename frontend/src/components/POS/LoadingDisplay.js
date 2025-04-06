import React from 'react';

/**
 * Loading display component for the POS system
 * Shown while products are being fetched
 */
const LoadingDisplay = () => (
    <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-6"></div>
        <p className="text-gray-600 font-medium">Loading products...</p>
    </div>
);

export default LoadingDisplay; 