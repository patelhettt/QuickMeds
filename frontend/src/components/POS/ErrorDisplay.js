import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Error display component for the POS system
 * Shown when there is an error loading products
 */
const ErrorDisplay = ({ error, reload }) => (
    <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-xl font-bold mb-4 text-gray-900">{error}</h2>
        <button 
            onClick={reload} 
            className="mt-4 py-2 px-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
            Retry
        </button>
    </div>
);

export default ErrorDisplay; 