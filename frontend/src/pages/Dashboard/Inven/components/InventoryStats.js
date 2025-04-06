import React from 'react';
import { FiBox, FiAlertTriangle, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';

const InventoryStats = ({ products, approvedItems = [] }) => {
    // Calculate inventory statistics
    const totalProducts = Array.isArray(products) ? products.length : 0;
    
    // Calculate total unique products (based on tradeName-strength-company)
    const uniqueProductsSet = new Set();
    if (Array.isArray(products)) {
        products.forEach(product => {
            const key = `${product.tradeName}-${product.strength}-${product.company}`;
            uniqueProductsSet.add(key);
        });
    }
    const uniqueProducts = uniqueProductsSet.size;
    
    // Calculate low stock products (stock <= 10) and out of stock products (stock === 0)
    const lowStockProducts = Array.isArray(products) 
        ? products.filter(p => {
            const stock = parseInt(p.stock) || 0;
            return stock > 0 && stock <= 10;
        }).length 
        : 0;
        
    const outOfStockProducts = Array.isArray(products) 
        ? products.filter(p => {
            const stock = parseInt(p.stock) || 0;
            return stock === 0;
        }).length 
        : 0;
    
    // Calculate total inventory value
    const totalValue = Array.isArray(products)
        ? products.reduce((sum, product) => {
            const stock = parseInt(product.stock) || 0;
            const packTp = parseFloat(product.packTp) || 0;
            return sum + (stock * packTp);
        }, 0)
        : 0;
        
    // Calculate approved orders statistics
    const totalApprovedItems = Array.isArray(approvedItems) ? approvedItems.length : 0;
    
    // Get unique orders count
    const uniqueOrdersSet = new Set();
    if (Array.isArray(approvedItems)) {
        approvedItems.forEach(item => {
            if (item.orderId) {
                uniqueOrdersSet.add(item.orderId);
            }
        });
    }
    const uniqueApprovedOrders = uniqueOrdersSet.size;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Total Products Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <FiBox className="text-blue-600 text-xl" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <div className="flex items-end">
                        <h3 className="text-2xl font-bold text-gray-800">{totalProducts}</h3>
                        <p className="ml-2 text-sm text-gray-500">({uniqueProducts} unique)</p>
                    </div>
                </div>
            </div>

            {/* Low Stock Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="rounded-full bg-amber-100 p-3 mr-4">
                    <FiAlertTriangle className="text-amber-600 text-xl" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <div className="flex items-end">
                        <h3 className="text-2xl font-bold text-gray-800">{lowStockProducts}</h3>
                        <p className="ml-2 text-sm text-gray-500">items</p>
                    </div>
                </div>
            </div>

            {/* Out of Stock Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="rounded-full bg-red-100 p-3 mr-4">
                    <FiAlertTriangle className="text-red-600 text-xl" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <div className="flex items-end">
                        <h3 className="text-2xl font-bold text-gray-800">{outOfStockProducts}</h3>
                        <p className="ml-2 text-sm text-gray-500">items</p>
                    </div>
                </div>
            </div>

            {/* Total Inventory Value */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                    <FiShoppingCart className="text-green-600 text-xl" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Inventory Value</p>
                    <div className="flex items-end">
                        <h3 className="text-2xl font-bold text-gray-800">₹{totalValue.toLocaleString()}</h3>
                    </div>
                </div>
            </div>
            
            {/* Approved Orders Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <FiCheckCircle className="text-purple-600 text-xl" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Approved Orders</p>
                    <div className="flex items-end">
                        <h3 className="text-2xl font-bold text-gray-800">{uniqueApprovedOrders}</h3>
                        <p className="ml-2 text-sm text-gray-500">({totalApprovedItems} items)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryStats; 