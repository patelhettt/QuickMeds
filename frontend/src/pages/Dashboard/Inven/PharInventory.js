import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import InventoryTable from './components/InventoryTable';
import InventoryHeader from './components/InventoryHeader';

// API URL
const API_URL = 'http://localhost:5000/api';

const PharInventory = () => {
    const [approvedItems, setApprovedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    
    // Get user info from localStorage
    useEffect(() => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUserInfo(parsedUser);
                console.log('User info loaded from localStorage:', parsedUser);
            }
        } catch (err) {
            console.error('Error loading user data from localStorage:', err);
        }
    }, []);
    
    const userRole = userInfo?.role || 'user';
    
    // Fetch inventory items (approved orders)
    const fetchInventoryItems = async () => {
        setIsLoading(true);
        setError(null);
        
        if (!userInfo) {
            setError("User information not available. Please log in again.");
            setIsLoading(false);
            return;
        }
        
        try {
            // Updated URL to correct endpoint for pharmacy orders
            const response = await fetch(`${API_URL}/orders/pharmacy`);
            
            if (!response.ok) {
                throw new Error(`Error fetching inventory: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Fetched orders:", data);
            
            // Filter only approved orders
            const approvedOrders = Array.isArray(data) 
                ? data.filter(order => order.status === 'approved')
                : [];
                
            console.log("Approved orders:", approvedOrders);
            
            // Filter orders based on user role and store
            let filteredOrders = [];
            
            if (userRole === 'superadmin') {
                // Superadmin sees all approved orders
                filteredOrders = approvedOrders;
                console.log("User is superadmin, showing all approved orders");
            } else {
                // For regular users and admins, show only orders for their store
                const userStoreNames = [];
                
                // Add primary store
                if (userInfo.store_name) {
                    userStoreNames.push(userInfo.store_name);
                }
                
                // Add associated stores if any
                if (userInfo.stores && Array.isArray(userInfo.stores)) {
                    userInfo.stores.forEach(store => {
                        const storeName = store.name || store.store_name;
                        if (storeName && !userStoreNames.includes(storeName)) {
                            userStoreNames.push(storeName);
                        }
                    });
                }
                
                console.log("User's stores:", userStoreNames);
                
                // Filter orders for user's stores
                filteredOrders = approvedOrders.filter(order => {
                    const orderStoreName = order.store_name || order.storeName;
                    return userStoreNames.includes(orderStoreName);
                });
                
                console.log(`Filtered orders for user's stores (${userStoreNames.join(', ')}):`, filteredOrders);
            }
            
            // Extract items from filtered orders
            const items = [];
            filteredOrders.forEach(order => {
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach(item => {
                        // Add order context to each item
                        items.push({
                            ...item,
                            orderId: order._id,
                            approvedBy: order.approvedByName || order.approvedBy,
                            approvedAt: order.approvedAt,
                            store_name: order.store_name || order.storeName,
                            orderCreatedAt: order.createdAt || order.requestedAt,
                            orderStatus: order.status
                        });
                    });
                }
            });
            
            console.log("Extracted approved items for user's stores:", items);
            setApprovedItems(items);
            
            if (items.length === 0) {
                toast.info("No inventory items found for your store.");
            } else {
                toast.success(`Loaded ${items.length} inventory items.`);
            }
            
        } catch (err) {
            console.error("Error fetching inventory:", err);
            setError(err.message);
            toast.error(`Failed to load inventory: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetch inventory on component mount
    useEffect(() => {
        fetchInventoryItems();
    }, [userInfo]); // Re-fetch if user info changes
    
    // Handle refresh button click
    const handleRefresh = () => {
        toast.info("Refreshing inventory...");
        fetchInventoryItems();
    };
    
    return (
        <section className="p-4 sm:p-6 mt-16 sm:mt-20 mx-2 sm:mx-4">
            <div className="space-y-4 sm:space-y-6 bg-white rounded-lg shadow-sm">
                {/* Header Section */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <InventoryHeader 
                        onRefresh={handleRefresh} 
                        isLoading={isLoading} 
                    />
                </div>

                {/* Store Information for non-superadmin users */}
                {userRole !== 'superadmin' && userInfo?.store_name && (
                    <div className="px-4 sm:px-6">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-sm text-blue-700 flex items-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs sm:text-sm">
                                Viewing inventory for <strong className="font-medium">{userInfo.store_name}</strong>
                                {userInfo.city && <span className="ml-1">(City: <span className="font-medium">{userInfo.city}</span>)</span>}
                            </span>
                        </div>
                    </div>
                )}
                
                {/* Error Message */}
                {error && (
                    <div className="px-4 sm:px-6">
                        <div className="bg-red-50 p-3 sm:p-4 rounded-lg text-red-800 flex flex-col">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm sm:text-base font-semibold">Error loading inventory</p>
                            </div>
                            <p className="mt-2 text-xs sm:text-sm">{error}</p>
                            <button 
                                className="mt-3 btn btn-xs sm:btn-sm btn-outline text-red-600 hover:bg-red-100 self-start"
                                onClick={fetchInventoryItems}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="bg-white rounded-lg overflow-x-auto border border-gray-200">
                        <InventoryTable 
                            approvedItems={approvedItems} 
                            isLoading={isLoading}
                            userRole={userRole}
                        />
                    </div>
                </div>

                {/* Empty State */}
                {!isLoading && !error && approvedItems.length === 0 && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No Inventory Items</h3>
                            <p className="text-xs sm:text-sm text-gray-500">No approved items found in your inventory.</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PharInventory; 