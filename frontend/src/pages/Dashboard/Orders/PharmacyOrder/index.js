import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import DashboardPageHeading from '../../../../components/headings/DashboardPageHeading';
import NewButton from '../../../../components/buttons/NewButton';
import RefreshButton from '../../../../components/buttons/RefreshButton';
import PrintButton from '../../../../components/buttons/PrintButton';
import CreateOrderModal from './CreateOrderModal';
import OrderTable from './OrderTable';
import OrderTableHeaders from './OrderTableHeaders';
import { formatDate, enrichOrdersWithUserDetails, handleApproveOrder, handleRejectOrder, showToast, TOAST_IDS as UTILS_TOAST_IDS } from './OrderUtils';
import axios from 'axios';
import { API_BASE_URL } from '../../../../config';

const TOAST_IDS = {
    ...UTILS_TOAST_IDS,
    REFRESH: 'refresh-orders',
    FETCH_SUCCESS: 'fetch-orders-success',
    FETCH_ERROR: 'fetch-orders-error',
    CREATE_SUCCESS: 'create-order-success',
    CREATE_ERROR: 'create-order-error',
    ORDER_APPROVAL: 'order-approval'
};

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
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [totalOrders, setTotalOrders] = useState(0);
    const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

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
                showToast('Order created successfully', 'success', TOAST_IDS.CREATE_SUCCESS);
                refreshOrders();
            })
            .catch(err => {
                showToast(`Error creating order: ${err.message}`, 'error', TOAST_IDS.CREATE_ERROR);
            });

        event.target.reset();
    };

    // Refresh orders with improved notification handling
    const refreshOrders = async () => {
        try {
            setIsLoading(true);

            // Clear existing toasts before showing new ones
            toast.dismiss(TOAST_IDS.REFRESH);
            toast.dismiss(TOAST_IDS.FETCH_SUCCESS);
            toast.dismiss(TOAST_IDS.FETCH_ERROR);

            // Show loading toast with short duration
            showToast("Refreshing orders...", 'info', TOAST_IDS.REFRESH);

            // Get user data from localStorage
            const userData = localStorage.getItem('user');
            let userId = null;
            let storeId = null;

            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    userId = parsedUser._id;
                    storeId = parsedUser.store_id; // Get store ID for filtering
                    console.log("User data loaded:", { userId, storeId, role: userRole, store: userStore });
                } catch (error) {
                    console.error("Error parsing user data:", error);
                }
            }

            // Build API URL based on user role
            let apiUrl = 'http://localhost:5000/api/orders/pharmacy';

            // Add query params if not superadmin
            if (userRole !== 'superadmin' && storeId) {
                apiUrl += `?store=${storeId}`;
                console.log("Filtering orders by store ID:", storeId);
            }

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const orders = await response.json();
            const enrichedOrders = await enrichOrdersWithUserDetails(orders);

            // Additional client-side filtering based on user role
            if (userRole === 'admin' && (storeId || userId)) {
                // Admin can only see orders from their own store or created by them
                const filteredOrders = enrichedOrders.filter(order => {
                    // Orders from this admin's store
                    if (storeId && order.store_id === storeId) return true;

                    // Orders from a store with matching name (fallback)
                    if (order.store_name && order.store_name === userStore) return true;

                    // Orders requested by this admin
                    if (order.requestedBy === userId) return true;

                    return false;
                });

                console.log(`Filtered: showing ${filteredOrders.length} orders for store: ${userStore}`);
                setPharmacyOrders(filteredOrders);

                // Dismiss the refresh toast before showing the success toast
                toast.dismiss(TOAST_IDS.REFRESH);

                // Show success toast with order count
                showToast(`Showing ${filteredOrders.length} orders for ${userStore}`, 'success', TOAST_IDS.FETCH_SUCCESS);
            } else {
                // Superadmin can see all orders
                console.log(`Showing all ${enrichedOrders.length} orders (superadmin view)`);
                setPharmacyOrders(enrichedOrders);

                // Dismiss the refresh toast before showing the success toast
                toast.dismiss(TOAST_IDS.REFRESH);

                // Show success toast with order count
                showToast(`Showing all ${enrichedOrders.length} orders`, 'success', TOAST_IDS.FETCH_SUCCESS);
            }
        } catch (error) {
            console.error("Error fetching pharmacy orders:", error);

            // Dismiss the refresh toast before showing the error toast
            toast.dismiss(TOAST_IDS.REFRESH);

            // Show error toast with detailed message
            showToast(`Failed to fetch orders: ${error.message}`, 'error', TOAST_IDS.FETCH_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    // Approve order with common utility
    const handleApproveOrder = async (orderId, partialApprovalData = null) => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`${API_BASE_URL}/orders/pharmacy/${orderId}/approve`, {
                approvedQuantities: partialApprovalData?.approvedQuantities || {},
                approvedBy: userRole,
                partialApprovalNote: partialApprovalData?.note || undefined,
                isPartialApproval: !!partialApprovalData
            });

            if (response.data.success) {
                showToast(
                    TOAST_IDS.ORDER_APPROVAL,
                    'success',
                    partialApprovalData ? 'Order partially approved successfully!' : 'Order approved successfully!'
                );
                fetchOrders();
            } else {
                showToast(
                    TOAST_IDS.ORDER_APPROVAL,
                    'error',
                    'Failed to approve order. Please try again.'
                );
            }
        } catch (error) {
            console.error('Error approving order:', error);
            showToast(
                TOAST_IDS.ORDER_APPROVAL,
                'error',
                error.response?.data?.message || 'Failed to approve order. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Reject order with common utility
    const onRejectOrder = async (orderId) => {
        const success = await handleRejectOrder(orderId, userRole);
        if (success) {
            // Update the orders list
            setPharmacyOrders(pharmacyOrders.map(order =>
                order._id === orderId ? { ...order, status: 'rejected' } : order
            ));
        }
    };

    // Improved fetchOrders function with proper axios request
    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            
            // Get user data
            const userData = localStorage.getItem('user');
            if (!userData) {
                showToast('User session not found. Please login again.', 'error', TOAST_IDS.FETCH_ERROR);
                return;
            }

            const parsedUser = JSON.parse(userData);
            const storeId = parsedUser.store_id;
            
            // Build API URL based on user role
            let apiUrl = 'http://localhost:5000/api/orders/pharmacy';
            if (userRole !== 'superadmin' && storeId) {
                apiUrl += `?store=${storeId}`;
            }

            const response = await axios.get(apiUrl, {
                params: {
                    page: currentPage,
                    limit: ordersPerPage,
                    status: selectedStatus,
                    search: searchQuery
                }
            });
            
            // Check if response.data is an array (old API format) or has a data property (new API format)
            const orders = Array.isArray(response.data) ? response.data : (response.data.data || []);
            
            // Enrich orders with user details
            const enrichedOrders = await enrichOrdersWithUserDetails(orders);
            
            // Filter orders based on user role if needed
            let filteredOrders = enrichedOrders;
            if (userRole === 'admin' && (storeId || parsedUser.store_name)) {
                filteredOrders = enrichedOrders.filter(order => {
                    return (
                        (storeId && order.store_id === storeId) ||
                        (order.store_name && order.store_name === parsedUser.store_name) ||
                        order.requestedBy === parsedUser._id
                    );
                });
            }

            console.log('Fetched orders:', filteredOrders); // Debug log
            setPharmacyOrders(filteredOrders);
            setTotalOrders(filteredOrders.length);
            
            // Show success message only if orders were found
            if (filteredOrders.length > 0) {
                showToast(
                    `Loaded ${filteredOrders.length} orders successfully`,
                    'success',
                    TOAST_IDS.FETCH_SUCCESS
                );
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            showToast('Failed to fetch orders. Please try again.', 'error', TOAST_IDS.FETCH_ERROR);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, ordersPerPage, selectedStatus, searchQuery, userRole]); // Dependencies for useCallback

    // Add visibility change detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Add visibility change listener
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup listener
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Effect for initial data loading
    useEffect(() => {
        const initializeData = async () => {
            try {
                // Clear existing toasts
                toast.dismiss(TOAST_IDS.REFRESH);
                toast.dismiss(TOAST_IDS.FETCH_SUCCESS);
                toast.dismiss(TOAST_IDS.FETCH_ERROR);

                // Get user data from localStorage
                const userData = localStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUserRole(parsedUser.role?.toLowerCase() || 'admin');
                    setUserStore(parsedUser.store_name || '');
                    setUserCity(parsedUser.city || '');
                } else {
                    setUserRole('admin');
                }

                // Fetch orders first
                await fetchOrders();

                // Then fetch dropdown data in parallel
                const [categoriesData, suppliersData, unitTypesData] = await Promise.all([
                    axios.get('http://localhost:5000/api/setup/categories'),
                    axios.get('http://localhost:5000/api/suppliers/lists'),
                    axios.get('http://localhost:5000/api/setup/unitTypes')
                ]);

                setCategories(categoriesData.data);
                setSuppliers(suppliersData.data);
                setUnitTypes(unitTypesData.data);

            } catch (error) {
                console.error("Error initializing data:", error);
                showToast('Failed to load initial data', 'error', TOAST_IDS.FETCH_ERROR);
            }
        };

        initializeData();
    }, []); // Empty dependency array for initial load only

    // Effect for auto-refreshing orders when component is visible
    useEffect(() => {
        let intervalId;

        if (isVisible) {
            // Fetch orders immediately when becoming visible
            fetchOrders();

            // Set up auto-refresh interval (every 30 seconds)
            intervalId = setInterval(() => {
                fetchOrders();
            }, 30000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isVisible, fetchOrders]);

    // Effect for handling filter changes
    useEffect(() => {
        fetchOrders();
    }, [currentPage, ordersPerPage, selectedStatus, searchQuery]);

    return (
        <section className='p-6 mt-20 mx-4 bg-white rounded-lg shadow-sm'>
            <div className="space-y-6">
                <DashboardPageHeading
                    name='Pharmacy Orders'
                    value={pharmacyOrders.length}
                    buttons={[
                        <RefreshButton
                            key="refresh"
                            onClick={fetchOrders} // Changed from handleManualRefresh to direct fetchOrders
                            isLoading={isLoading}
                        />,
                        <PrintButton key="print" />
                    ]}
                />

                {userRole === 'admin' && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-700 flex items-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                            You are viewing orders for <strong className="font-medium">{userStore}</strong> store only.
                            {userCity && <span className="ml-1">(City: <span className="font-medium">{userCity}</span>)</span>}
                        </span>
                    </div>
                )}

                <div className="mb-6">
                    <CreateOrderModal
                        addPharmacyOrder={addPharmacyOrder}
                        suppliers={suppliers}
                        categories={categories}
                        unitTypes={unitTypes}
                        pharmacyOrders={pharmacyOrders}
                        modalTableHead1={modalTableHead1}
                        modalTableHead2={modalTableHead2}
                    />
                </div>

                <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                    <OrderTable
                        pharmacyOrders={pharmacyOrders}
                        tableHead={tableHead}
                        expandedOrderId={expandedOrderId}
                        toggleExpandRow={toggleExpandRow}
                        formatDate={formatDate}
                        handleApproveOrder={handleApproveOrder}
                        handleRejectOrder={onRejectOrder}
                        userRole={userRole}
                        isLoading={isLoading}
                    />
                </div>

                {/* Add a subtle loading indicator for background refreshes */}
                {isLoading && (
                    <div className="fixed top-4 right-4 z-50">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-sm text-gray-600">Updating...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Add loading indicator */}
            {isLoading && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="text-gray-700">Loading...</span>
                    </div>
                </div>
            )}

            {/* Show no orders message with better UX */}
            {!isLoading && pharmacyOrders.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {userRole === 'admin' 
                            ? `No orders found for ${userStore}. Create a new order to get started.`
                            : 'No orders found in the system.'}
                    </p>
                </div>
            )}
        </section>
    );
};

export default PharmacyOrders; 