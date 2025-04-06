import React from 'react';
import { ShoppingCart, RefreshCw } from 'lucide-react';
import { RiMedicineBottleFill } from 'react-icons/ri';
import { usePOSContext } from './POSContext';

const POSHeader = () => {
    const { cartQuantity, handleReload } = usePOSContext();

    return (
        <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <RiMedicineBottleFill className="text-2xl text-primary mr-2" />
                        <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            QuickMeds POS
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                                <ShoppingCart className="h-5 w-5" />
                                {cartQuantity > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-secondary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                                        {cartQuantity}
                                    </span>
                                )}
                            </button>
                        </div>
                        <button 
                            onClick={handleReload} 
                            className="text-primary hover:text-secondary transition-colors"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default POSHeader; 