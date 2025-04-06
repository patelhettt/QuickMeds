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
        <div className="space-y-6">
            {/* Header with refresh button */}
            <InventoryHeader onRefresh={handleRefresh} isLoading={isLoading} />
            
            {/* Error message */}
            {error && (
                <div className="bg-red-50 p-4 rounded-lg text-red-800 mb-4">
                    <p className="font-semibold">Error loading inventory</p>
                    <p>{error}</p>
                    <button 
                        className="mt-2 btn btn-sm btn-outline text-red-600 hover:bg-red-100"
                        onClick={fetchInventoryItems}
                    >
                        Try Again
                    </button>
                </div>
            )}
            
            {/* Inventory table */}
            <InventoryTable 
                approvedItems={approvedItems} 
                isLoading={isLoading}
                userRole={userRole}
            />
        </div>
    );
};

export default PharInventory; 