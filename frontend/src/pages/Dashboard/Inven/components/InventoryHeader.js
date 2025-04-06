import React from 'react';
import RefreshButton from '../../../../components/buttons/RefreshButton';
import PrintButton from '../../../../components/buttons/PrintButton';

const InventoryHeader = ({ onRefresh, isLoading }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-md">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Pharmacy Inventory</h1>
                <p className="text-gray-600">
                    Manage your pharmacy products inventory
                </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <RefreshButton 
                    onClick={onRefresh}
                    isLoading={isLoading}
                    btnSize="btn-sm"
                />
                
                <PrintButton 
                    btnSize="btn-sm"
                />
            </div>
        </div>
    );
};

export default InventoryHeader; 