import React, { useState, useEffect } from 'react';
import SaveButton from '../../../components/buttons/SaveButton';
import CancelButton from '../../../components/buttons/CancelButton';
import PrintButton from '../../../components/buttons/PrintButton';
import NewButton from '../../../components/buttons/NewButton';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import ModalCloseButton from '../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../components/headings/ModalHeading';
import { toast } from 'react-toastify';
import DashboardPageHeading from '../../../components/headings/DashboardPageHeading';
import PrintButton2 from '../../../components/buttons/PrintButton2';
import EditButton from '../../../components/buttons/EditButton';
import DeleteButton from '../../../components/buttons/DeleteButton'; 
import RefreshButton from '../../../components/buttons/RefreshButton';

// Helper function to format stock display
const formatStock = (stock) => {
    const stockNum = parseInt(stock) || 0;
    if (stockNum === 0) {
        return <span className="text-red-500 font-semibold">Out of Stock</span>;
    } else if (stockNum <= 10) {
        return <span className="text-amber-500 font-semibold">{stockNum} (Low)</span>;
    } else {
        return <span className="text-green-500 font-semibold">{stockNum}</span>;
    }
};

const PharInventoryy = () => {
    const tableHeadItems = ['SN', 'Trade Name', 'Generic Name', 'Strength', 'Category', 'Company', 'Stock', 'Pack Type', 'Pack TP', 'Pack MRP', 'Actions'];
    const approvedOrdersTableHeadItems = [
        'SN', 
        'Order ID', 
        'Item Name', 
        'Strength', 
        'Category', 
        'Quantity', 
        'Approved By', 
        'Approved At', 
        'Store Name',
        'Status'
    ];

    const modalTableHeadItems = ['SN', 'Name', 'Strength', 'Company', 'Category', 'Pack Type', 'Stock', 'Actions'];

    const tableHead = <tr>
        {
            tableHeadItems?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    const approvedOrdersTableHead = <tr>
        {
            approvedOrdersTableHeadItems?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    const modalTableHead = <tr>
        {
            modalTableHeadItems?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    // State variables
    const [pharmacyProducts, setPharmacyProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [approvedItems, setApprovedItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('all'); // 'all', 'low', 'out'
    const [isLoading, setIsLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'approvedOrders'
    const [currentUser, setCurrentUser] = useState(null);
    const [approvedOrdersSearchTerm, setApprovedOrdersSearchTerm] = useState('');
    const [approvedOrdersCategoryFilter, setApprovedOrdersCategoryFilter] = useState('');
    const [filteredApprovedItems, setFilteredApprovedItems] = useState([]);
    const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'

    // Get current user from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setCurrentUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    // Fetch pharmacy products
    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:5000/api/products/pharmacy')
            .then(res => res.json())
            .then(data => {
                // Ensure data is an array
                const productsArray = Array.isArray(data) ? data : [];
                setPharmacyProducts(productsArray);
                setFilteredProducts(productsArray);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching pharmacy products:", error);
                toast.error("Failed to fetch pharmacy products");
                setIsLoading(false);
                // Initialize with empty arrays on error
                setPharmacyProducts([]);
                setFilteredProducts([]);
            });
    }, [refreshTrigger]);

    // Fetch approved orders
    useEffect(() => {
        if (!currentUser) return;
        
        setIsLoading(true);
        fetch('http://localhost:5000/api/orders/pharmacy')
            .then(res => res.json())
            .then(data => {
                console.log("All orders from API:", data);
                console.log("Current user:", currentUser);
                
                // Filter for approved orders
                const approvedOrdersArray = Array.isArray(data) 
                    ? data.filter(order => order.status === 'approved')
                    : [];
                
                console.log("Approved orders:", approvedOrdersArray);
                
                // Filter for orders relevant to the current user
                let userOrders = [];
                
                if (currentUser.role === 'superadmin') {
                    // Superadmin sees all approved orders
                    userOrders = approvedOrdersArray;
                    console.log("User is superadmin, showing all approved orders");
                } else if (currentUser.role === 'admin') {
                    // For debugging, log the user's store information
                    console.log("Admin user store info:", {
                        userId: currentUser._id,
                        storeName: currentUser.store_name,
                        stores: currentUser.stores
                    });
                    
                    // For admin, show orders they approved or from their store
                    userOrders = approvedOrdersArray.filter(order => {
                        // Check if the order has a store_name or storeName field
                        const orderStoreName = order.store_name || order.storeName;
                        console.log(`Checking order ${order._id}:`, {
                            orderStoreName,
                            userStoreName: currentUser.store_name,
                            approvedBy: order.approvedBy,
                            userId: currentUser._id
                        });
                        
                        // Check if user approved this order
                        const userApproved = order.approvedBy === currentUser._id;
                        
                        // Check if order is for user's primary store
                        const isUserPrimaryStore = orderStoreName === currentUser.store_name;
                        
                        // Check if order is for any of user's associated stores
                        let isUserAssociatedStore = false;
                        if (currentUser.stores && Array.isArray(currentUser.stores)) {
                            isUserAssociatedStore = currentUser.stores.some(store => {
                                const storeName = store.name || store.store_name;
                                return storeName === orderStoreName;
                            });
                        }
                        
                        const isRelevant = userApproved || isUserPrimaryStore || isUserAssociatedStore;
                        console.log(`Order ${order._id} relevant to admin: ${isRelevant}`);
                        return isRelevant;
                    });
                } else {
                    // For other roles, don't show any orders
                    userOrders = [];
                    console.log("User has neither superadmin nor admin role");
                }
                
                console.log("User-filtered orders:", userOrders);
                setApprovedOrders(userOrders);
                
                // Extract all items from approved orders with additional context
                const items = [];
                userOrders.forEach(order => {
                    if (order.items && Array.isArray(order.items)) {
                        console.log(`Processing items from order ${order._id}:`, order.items);
                        order.items.forEach(item => {
                            // Add order context to each item
                            items.push({
                                ...item,
                                orderId: order._id,
                                approvedBy: order.approvedByName || order.approvedBy, // Use name if available
                                approvedAt: order.approvedAt,
                                store_name: order.store_name || order.storeName,
                                orderCreatedAt: order.createdAt || order.requestedAt,
                                orderStatus: order.status,
                                approverRole: order.approverRole || 'superadmin' // Default to superadmin if not specified
                            });
                        });
                    } else {
                        console.log(`No items or invalid items in order ${order._id}`);
                    }
                });
                
                console.log("Extracted items:", items);
                setApprovedItems(items);
                setFilteredApprovedItems(items); // Initialize filtered items
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching approved orders:", error);
                toast.error("Failed to fetch approved orders");
                setIsLoading(false);
                setApprovedOrders([]);
                setApprovedItems([]);
                setFilteredApprovedItems([]);
            });
    }, [currentUser, refreshTrigger]);

    // Fetch categories
    useEffect(() => {
        fetch('http://localhost:5000/api/setup/categories')
            .then(res => res.json())
            .then(data => {
                // Ensure data is an array
                setCategories(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
                setCategories([]);
            });
    }, []);

    // Fetch companies
    useEffect(() => {
        fetch('http://localhost:5000/api/setup/companies')
            .then(res => res.json())
            .then(data => {
                // Ensure data is an array
                setCompanies(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error("Error fetching companies:", error);
                setCompanies([]);
            });
    }, []);

    // Filter products based on search term, category, company, and stock level
    useEffect(() => {
        if (!Array.isArray(pharmacyProducts)) {
            setFilteredProducts([]);
            return;
        }
        
        let results = [...pharmacyProducts];
        
        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(product => 
                (product.tradeName && product.tradeName.toLowerCase().includes(term)) ||
                (product.genericName && product.genericName.toLowerCase().includes(term)) ||
                (product.strength && product.strength.toLowerCase().includes(term))
            );
        }
        
        // Apply category filter
        if (categoryFilter) {
            results = results.filter(product => 
                product.category === categoryFilter
            );
        }
        
        // Apply company filter
        if (companyFilter) {
            results = results.filter(product => 
                product.company === companyFilter
            );
        }
        
        // Apply stock filter
        if (stockFilter === 'low') {
            results = results.filter(product => {
                const stock = parseInt(product.stock) || 0;
                return stock > 0 && stock <= 10;
            });
        } else if (stockFilter === 'out') {
            results = results.filter(product => {
                const stock = parseInt(product.stock) || 0;
                return stock === 0;
            });
        }
        
        setFilteredProducts(results);
    }, [searchTerm, categoryFilter, companyFilter, stockFilter, pharmacyProducts]);

    // Initialize filteredApprovedItems with all approvedItems
    useEffect(() => {
        setFilteredApprovedItems(approvedItems);
    }, [approvedItems]);

    // Filter approved items based on search and category
    useEffect(() => {
        if (!Array.isArray(approvedItems)) {
            setFilteredApprovedItems([]);
            return;
        }
        
        let results = [...approvedItems];
        
        // Apply search filter
        if (approvedOrdersSearchTerm) {
            const term = approvedOrdersSearchTerm.toLowerCase();
            results = results.filter(item => 
                (item.name && item.name.toLowerCase().includes(term)) ||
                (item.strength && item.strength.toLowerCase().includes(term)) ||
                (item.orderId && item.orderId.toLowerCase().includes(term)) ||
                (item.store_name && item.store_name.toLowerCase().includes(term))
            );
        }
        
        // Apply category filter
        if (approvedOrdersCategoryFilter) {
            results = results.filter(item => 
                item.category === approvedOrdersCategoryFilter
            );
        }
        
        // Apply date filter
        if (dateFilter !== 'all') {
            results = results.filter(item => filterByDate(item, dateFilter));
        }
        
        setFilteredApprovedItems(results);
    }, [approvedOrdersSearchTerm, approvedOrdersCategoryFilter, dateFilter, approvedItems]);

    // Add this function to filter by date
    const filterByDate = (item, filter) => {
        if (filter === 'all') return true;
        
        const approvedDate = new Date(item.approvedAt);
        const today = new Date();
        
        // Reset hours to compare just the dates
        today.setHours(0, 0, 0, 0);
        
        if (filter === 'today') {
            const itemDate = new Date(approvedDate);
            itemDate.setHours(0, 0, 0, 0);
            return itemDate.getTime() === today.getTime();
        }
        
        if (filter === 'week') {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return approvedDate >= weekAgo;
        }
        
        if (filter === 'month') {
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            return approvedDate >= monthAgo;
        }
        
        return true;
    };

    // Handle refresh button click
    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Add new pharmacy product
    const addPharmacyProduct = (event) => {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const productData = {
            tradeName: formData.get('tradeName'),
            genericName: formData.get('genericName'),
            strength: formData.get('strength'),
            category: formData.get('category'),
            company: formData.get('company'),
            packType: formData.get('packType'),
            stock: parseInt(formData.get('stock')) || 0,
            packTp: parseFloat(formData.get('packTp')) || 0,
            unitTp: parseFloat(formData.get('unitTp')) || 0,
            packMrp: parseFloat(formData.get('packMrp')) || 0,
            unitMrp: parseFloat(formData.get('unitMrp')) || 0,
            purchaseVatPercent: parseFloat(formData.get('purchaseVatPercent')) || 0,
            purchaseDiscountPercent: parseFloat(formData.get('purchaseDiscountPercent')) || 0,
            salesVatPercent: parseFloat(formData.get('salesVatPercent')) || 0,
            salesDiscountPercent: parseFloat(formData.get('salesDiscountPercent')) || 0,
            addedBy: 'admin',
            addedToDbAt: new Date()
        };
        
        // Calculate derived values
        productData.purchaseVatTaka = (productData.packTp * productData.purchaseVatPercent) / 100;
        productData.purchaseDiscountTaka = (productData.packTp * productData.purchaseDiscountPercent) / 100;
        productData.salesVatTaka = (productData.packMrp * productData.salesVatPercent) / 100;
        productData.salesDiscountTaka = (productData.packMrp * productData.salesDiscountPercent) / 100;
        
        setIsLoading(true);
        fetch('http://localhost:5000/api/products/pharmacy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    toast.success('Product added successfully');
                    handleRefresh();
                    // Close modal
                    document.getElementById('create-new-product').checked = false;
                } else {
                    toast.error(data.message || 'Failed to add product');
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error adding product:", error);
                toast.error("An error occurred while adding the product");
                setIsLoading(false);
            });
    };

    return (
        <section className='p-2 md:p-4 lg:p-6'>
            {/* <DashboardPageHeading pageHeading='Pharmacy Inventory List'>
                <NewButton modalId='create-new-product' />
                <RefreshButton onClick={handleRefresh} />
                <PrintButton />
            </DashboardPageHeading> */}

            {/* Inventory Stats */}
            <div className="stats shadow mb-6 w-full">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Orders</div>
                    <div className="stat-value">{approvedOrders.length}</div>
                    <div className="stat-desc">Approved orders for your store</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Items</div>
                    <div className="stat-value">{approvedItems.length}</div>
                    <div className="stat-desc">Items from approved orders</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <div className="avatar">
                            <div className="w-16 rounded-full">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="User avatar" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-value">{currentUser?.store_name || 'N/A'}</div>
                    <div className="stat-title">Your Store</div>
                    <div className="stat-desc text-secondary">
                        {currentUser?.role === 'admin' ? 'Admin Access' : 
                         currentUser?.role === 'superadmin' ? 'Superadmin Access' : 'Limited Access'}
                    </div>
                </div>
            </div>

            {/* Simple Search */}
            <div className="bg-base-100 p-4 mb-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <input 
                            type="text" 
                            placeholder="Search by name, category, or store..." 
                            className="input input-bordered w-full" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                // You can add specific search logic here if needed
                                console.log("Searching for:", searchTerm);
                            }}
                        >
                            Search
                        </button>
                        <button 
                            className="btn btn-outline"
                            onClick={() => {
                                setSearchTerm('');
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Approved Orders Table */}
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">
                            Showing {approvedItems.length} approved items
                        </h3>
                    </div>
                    
                    {approvedItems.length === 0 ? (
                        <div className="bg-base-200 p-6 rounded-lg text-center">
                            <h3 className="text-xl font-bold mb-2">No Approved Orders Found</h3>
                            <p className="mb-4">
                                {currentUser && currentUser.role === 'admin' 
                                    ? "As an admin, you can only see orders that were either approved by you or are for your assigned store."
                                    : currentUser && currentUser.role === 'superadmin'
                                        ? "There are no approved orders in the system yet."
                                        : "You don't have permission to view approved orders."}
                            </p>
                            <div className="flex justify-center">
                                <button 
                                    className="btn btn-primary"
                                    onClick={handleRefresh}
                                >
                                    Refresh Data
                                </button>
                            </div>
                        </div>
                    ) : (
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>Order ID</th>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Strength</th>
                                    <th>Quantity</th>
                                    <th>Approved By</th>
                                    <th>Store</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedItems
                                    .filter(item => {
                                        if (!searchTerm) return true;
                                        const term = searchTerm.toLowerCase();
                                        return (
                                            (item.name && item.name.toLowerCase().includes(term)) ||
                                            (item.category && item.category.toLowerCase().includes(term)) ||
                                            (item.store_name && item.store_name.toLowerCase().includes(term)) ||
                                            (item.strength && item.strength.toLowerCase().includes(term))
                                        );
                                    })
                                    .map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="tooltip" data-tip={item.orderId}>
                                                    {item.orderId?.substring(0, 8) || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="font-medium">{item.name || 'N/A'}</td>
                                            <td>{item.category || 'N/A'}</td>
                                            <td>{item.strength || 'N/A'}</td>
                                            <td className="font-bold text-primary">{item.quantity || 0}</td>
                                            <td>{item.approvedBy || 'N/A'}</td>
                                            <td>
                                                <span className="badge badge-ghost">{item.store_name || 'N/A'}</span>
                                            </td>
                                            <td>
                                                <span className="badge badge-success">Approved</span>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </section>
    );
};

export default PharInventoryy;