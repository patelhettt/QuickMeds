import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardPageHeading from '../../../../components/headings/DashboardPageHeading';
import NewButton from '../../../../components/buttons/NewButton';
import RefreshButton from '../../../../components/buttons/RefreshButton';
import PrintButton from '../../../../components/buttons/PrintButton';
import CreateOrderModal from './CreateOrderModal';
import OrderTable from './OrderTable';
import OrderTableHeaders from './OrderTableHeaders';
import { formatDate, enrichOrdersWithUserDetails, handleApproveOrder, handleRejectOrder } from './OrderUtils';

const PharmacyOrders = () => {
    const [pharmacyOrders, setPharmacyOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [userRole, setUserRole] = useState('superadmin');
    const [userStore, setUserStore] = useState('');
    const [userCity, setUserCity] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Get table headers
    const { tableHead, modalTableHead1, modalTableHead2 } = OrderTableHeaders;

    // Toggle expanded row
    const toggleExpandRow = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    // Add pharmacy order to db
    const addPharmacyOrder = event => {
        event.preventDefault();

        const supplier = event?.target?.supplier?.value;
        const tradeName = event?.target?.tradeName?.value;
        const category = event?.target?.category?.value;
        const strength = event?.target?.strength?.value;
        const boxType = event?.target?.boxType?.value;
        const unitType = event?.target?.unitType?.value;
        const creator = 'admin';
        const createdAt = new Date();

        const productDetails = { supplier, tradeName, category, strength, boxType, unitType, creator, createdAt };

        // send data to server
        fetch('http://localhost:5000/api/orders/pharmacy', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(productDetails)
        })
            .then(res => res.json())
            .then(data => {
                toast.success('Order created successfully');
                refreshOrders();
            })
            .catch(err => {
                toast.error(`Error creating order: ${err.message}`);
            });

        event.target.reset();
    };

    // Refresh orders
    const refreshOrders = async () => {
        try {
            setIsLoading(true);
            toast.info("Refreshing orders...", { autoClose: 1000 });
            
            const userData = localStorage.getItem('user');
            let userId = null;
            
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    userId = parsedUser._id;
                } catch (error) {
                    console.error("Error parsing user data:", error);
                }
            }
            
            const response = await fetch('http://localhost:5000/api/orders/pharmacy');
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const orders = await response.json();
            const enrichedOrders = await enrichOrdersWithUserDetails(orders);
            
            // Filter orders based on user role
            if (userRole === 'admin' && userId) {
                // Admin can only see orders from their own store
                const filteredOrders = enrichedOrders.filter(order => {
                    // Only orders from this admin's store
                    if (order.store_name && order.store_name === userStore) return true;
                    
                    // If the order was requested by this admin
                    if (order.requestedBy === userId) return true;
                    
                    return false;
                });
                
                console.log(`Filtered: showing ${filteredOrders.length} orders for store: ${userStore}`);
                setPharmacyOrders(filteredOrders);
                toast.success(`Showing ${filteredOrders.length} orders for ${userStore}`);
            } else {
                // Superadmin can see all orders
                console.log(`Showing all ${enrichedOrders.length} orders (superadmin view)`);
                setPharmacyOrders(enrichedOrders);
                toast.success(`Showing all ${enrichedOrders.length} orders`);
            }
        } catch (error) {
            console.error("Error fetching pharmacy orders:", error);
            toast.error(`Failed to fetch orders: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Approve order with common utility
    const onApproveOrder = async (orderId) => {
        const success = await handleApproveOrder(orderId, userRole, setIsLoading);
        if (success) {
            // Update the orders list
            setPharmacyOrders(pharmacyOrders.map(order => 
                order._id === orderId ? {...order, status: 'approved'} : order
            ));
            
            // Refresh orders to ensure everything is up to date
            refreshOrders();
        }
    };

    // Reject order with common utility
    const onRejectOrder = async (orderId) => {
        const success = await handleRejectOrder(orderId, userRole);
        if (success) {
            // Update the orders list
            setPharmacyOrders(pharmacyOrders.map(order => 
                order._id === orderId ? {...order, status: 'rejected'} : order
            ));
        }
    };

    // Fetch all necessary data
    useEffect(() => {
        // Default to admin role for safety
        setUserRole('admin');
        
        // Try to get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                if (parsedUser && parsedUser.role) {
                    setUserRole(parsedUser.role.toLowerCase());
                    console.log("User role set from localStorage:", parsedUser.role.toLowerCase());
                }
                
                // Set user store and city
                if (parsedUser.store_name) {
                    setUserStore(parsedUser.store_name);
                }
                if (parsedUser.city) {
                    setUserCity(parsedUser.city);
                }
                
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
        
        // Fetch orders
        refreshOrders();
        
        // Get categories data
        fetch('http://localhost:5000/api/setup/categories')
            .then(res => res.json())
            .then(c => setCategories(c))
            .catch(error => console.error("Error fetching categories:", error));

        // Get suppliers data
        fetch('http://localhost:5000/api/suppliers/lists')
            .then(res => res.json())
            .then(s => setSuppliers(s))
            .catch(error => console.error("Error fetching suppliers:", error));

        // Get unit types data
        fetch('http://localhost:5000/api/setup/unitTypes')
            .then(res => res.json())
            .then(ut => setUnitTypes(ut))
            .catch(error => console.error("Error fetching unit types:", error));
    }, []);

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Pharmacy Orders'
                value={pharmacyOrders.length}
                buttons={[
                    <NewButton key="new" modalId='create-new-product' />,
                    <RefreshButton 
                        key="refresh" 
                        onClick={refreshOrders}
                        isLoading={isLoading}
                    />,
                    <PrintButton key="print" />
                ]}
            />
            
            {userRole === 'admin' && (
                <div className="bg-blue-50 p-2 rounded-md mb-4 text-sm text-blue-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        You are viewing orders for <strong>{userStore}</strong> store only. 
                        {userCity && <span> (City: {userCity})</span>}
                    </span>
                </div>
            )}

            <CreateOrderModal
                addPharmacyOrder={addPharmacyOrder}
                suppliers={suppliers}
                categories={categories}
                unitTypes={unitTypes}
                pharmacyOrders={pharmacyOrders}
                modalTableHead1={modalTableHead1}
                modalTableHead2={modalTableHead2}
            />

            <OrderTable
                pharmacyOrders={pharmacyOrders}
                tableHead={tableHead}
                expandedOrderId={expandedOrderId}
                toggleExpandRow={toggleExpandRow}
                formatDate={formatDate}
                handleApproveOrder={onApproveOrder}
                handleRejectOrder={onRejectOrder}
                userRole={userRole}
                isLoading={isLoading}
            />
        </section>
    );
};

export default PharmacyOrders; 