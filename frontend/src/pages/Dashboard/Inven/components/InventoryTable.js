import React, { useMemo, useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiSearch, FiBarChart, FiDownload } from 'react-icons/fi';

// Format stock with color indicators
const formatStock = (stock) => {
    const stockNum = parseInt(stock) || 0;
    if (stockNum === 0) {
        return <span className="badge badge-error">Out of Stock</span>;
    } else if (stockNum <= 10) {
        return <span className="badge badge-warning">{stockNum} (Low)</span>;
    } else {
        return <span className="badge badge-success">{stockNum}</span>;
    }
};

// Format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
};

const InventoryTable = ({ products, approvedItems = [], isLoading, userRole }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showSummary, setShowSummary] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    
    // Debug incoming approved items data
    useEffect(() => {
        console.log("InventoryTable received approved items:", approvedItems);
        console.log("Approved items array length:", Array.isArray(approvedItems) ? approvedItems.length : 'Not an array');
    }, [approvedItems]);

    // Filter items based on search term
    const filteredItems = Array.isArray(approvedItems) ? 
        searchTerm ? 
            approvedItems.filter(item => 
                (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
            ) 
            : approvedItems 
        : [];
        
    // Create consolidated summary of items
    const consolidatedItems = useMemo(() => {
        if (!Array.isArray(approvedItems) || approvedItems.length === 0) {
            return [];
        }
        
        const itemMap = new Map();
        
        // Group items by name and category
        approvedItems.forEach(item => {
            if (!item.name) return;
            
            const key = `${item.name}-${item.category || 'unknown'}`;
            
            if (itemMap.has(key)) {
                // Update existing entry
                const existingItem = itemMap.get(key);
                existingItem.totalQuantity += parseInt(item.quantity) || 0;
                existingItem.count += 1;
                // Keep track of stores where this item is present
                if (item.store_name && !existingItem.stores.includes(item.store_name)) {
                    existingItem.stores.push(item.store_name);
                }
            } else {
                // Add new entry
                itemMap.set(key, {
                    name: item.name,
                    category: item.category || 'Unknown',
                    totalQuantity: parseInt(item.quantity) || 0,
                    count: 1,
                    stores: item.store_name ? [item.store_name] : []
                });
            }
        });
        
        return Array.from(itemMap.values())
            .sort((a, b) => b.totalQuantity - a.totalQuantity);
    }, [approvedItems]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const noApprovedItemsMessage = (
        <div className="bg-white p-6 rounded-lg text-center shadow-md">
            <h3 className="text-xl font-bold mb-2">No Inventory Stock Items Found</h3>
            <p className="text-gray-600">
                There are no approved order items in your inventory.
                {userRole !== 'superadmin' && (
                    <span className="block mt-2 text-sm">
                        Note: As an admin, you can only see orders that were either approved by you or are for your assigned store.
                    </span>
                )}
            </p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Summary Table (Consolidated Products) */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-50 p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-green-900">
                            Consolidated Inventory Summary
                        </h2>
                        <p className="text-sm text-green-700">
                            {consolidatedItems.length} unique products with a total of {consolidatedItems.reduce((sum, item) => sum + item.totalQuantity, 0)} items in stock
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            className="btn btn-sm btn-outline gap-2" 
                            onClick={() => setShowSummary(!showSummary)}
                        >
                            {showSummary ? 'Hide' : 'Show'} Summary
                        </button>
                        <button 
                            className="btn btn-sm btn-primary gap-2" 
                        >
                            <FiDownload className="h-4 w-4" />
                            Export
                        </button>
                    </div>
                </div>

                {showSummary && (
                    <div className="overflow-x-auto">
                        {consolidatedItems.length === 0 ? (
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-bold mb-2">No products to summarize</h3>
                            </div>
                        ) : (
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left">SN</th>
                                        <th className="text-left">Item Name</th>
                                        <th className="text-left">Category</th>
                                        <th className="text-center">Total Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consolidatedItems.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                                            <td className="text-left">{index + 1}</td>
                                            <td className="text-left font-medium">{item.name || 'N/A'}</td>
                                            <td className="text-left">
                                                <span className="badge badge-ghost">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                {formatStock(item.totalQuantity)}
                                                {item.count > 1 && (
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        (from {item.count} orders)
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* Toggle button for detailed inventory */}
            <div className="flex justify-end">
                <button 
                    className="btn btn-sm btn-outline gap-2" 
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? 'Hide' : 'Show'} Detailed Inventory
                </button>
            </div>

            {/* Inventory Stock Details (Approved Items) */}
            {showDetails && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-blue-50 p-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-blue-900">
                            Inventory Stock Details ({filteredItems.length} items)
                        </h2>
                        <div className="flex items-center gap-2">
                            {showSearch ? (
                                <div className="flex items-center">
                                    <input 
                                        type="text" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search..." 
                                        className="input input-bordered input-sm mr-2"
                                        autoFocus
                                    />
                                    <button 
                                        className="btn btn-sm" 
                                        onClick={() => {
                                            setShowSearch(false);
                                            setSearchTerm('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    className="btn btn-sm btn-primary gap-2" 
                                    onClick={() => setShowSearch(true)}
                                >
                                    <FiSearch />
                                    Search
                                </button>
                            )}
                        </div>
                    </div>

                    {(!Array.isArray(filteredItems) || filteredItems.length === 0) ? (
                        <div className="p-4">
                            {searchTerm ? (
                                <div className="p-6 text-center">
                                    <h3 className="text-lg font-bold mb-2">No items found matching "{searchTerm}"</h3>
                                    <button 
                                        className="btn btn-sm btn-primary mt-2" 
                                        onClick={() => {
                                            setSearchTerm('');
                                        }}
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            ) : (
                                noApprovedItemsMessage
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left">SN</th>
                                        <th className="text-left">Item Name</th>
                                        <th className="text-left">Category</th>
                                        <th className="text-center">Stock Quantity</th>
                                        <th className="text-left">Date Added</th>
                                        <th className="text-left">Store</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                                            <td className="text-left">{index + 1}</td>
                                            <td className="text-left font-medium">{item.name || 'N/A'}</td>
                                            <td className="text-left">
                                                <span className="badge badge-ghost">
                                                    {item.category || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="text-center font-bold text-blue-600">{item.quantity || 0}</td>
                                            <td className="text-left">{formatDate(item.approvedAt)}</td>
                                            <td className="text-left">
                                                <span className="badge badge-primary">{item.store_name || 'N/A'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InventoryTable; 