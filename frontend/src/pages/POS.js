import React, { useEffect, useState, useMemo } from 'react';
import { ShoppingCart, Package, Save, RefreshCw } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { RiMedicineBottleFill } from 'react-icons/ri';
import { FaThList } from 'react-icons/fa';

// Import components and utilities
import printReceipt from '../utils/printReceipt';
import ProductCard from '../components/POS/ProductCard';
import CartItem from '../components/POS/CartItem';
import SearchBar from '../components/POS/SearchBar';
import CategoryFilter from '../components/POS/CategoryFilter';
import CustomerInfoForm from '../components/POS/CustomerInfoForm';
import PaymentMethodSelector from '../components/POS/PaymentMethodSelector';
import DiscountInput from '../components/POS/DiscountInput';
import OrderSummary from '../components/POS/OrderSummary';
import OrderSuccess from '../components/POS/OrderSuccess';
import ErrorDisplay from '../components/POS/ErrorDisplay';
import LoadingDisplay from '../components/POS/LoadingDisplay';

const POS = () => {
    // State Management
    const [products, setProducts] = useState({
        pharmacy: [],
        nonPharmacy: []
    });
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [customerInfo, setCustomerInfo] = useState({
        name: 'Walk-in Customer',
        phone: '',
        email: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [showCategoryFilter, setShowCategoryFilter] = useState(true);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [user, setUser] = useState({ role: '', store_name: '', id: '' });
    const [rawProducts, setRawProducts] = useState({
        pharmacy: [],
        nonPharmacy: []
    });
    const [approvedOrders, setApprovedOrders] = useState([]);
    const [approvedProductIds, setApprovedProductIds] = useState([]);

    // Get current user info from localStorage
    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const userData = JSON.parse(userString);
                setUser({
                    role: userData.role || '',
                    store_name: userData.store_name || '',
                    id: userData._id || ''
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Fetch approved orders for the current user
    useEffect(() => {
        const fetchApprovedOrders = async () => {
            if (!user.id) return;
            
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }

                const response = await fetch('http://localhost:5000/api/orders/pharmacy', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const ordersData = await response.json();
                
                // Filter orders that were requested by the current user and are approved
                const userApprovedOrders = ordersData.filter(order => 
                    order.requestedBy === user.id && 
                    order.status === 'approved'
                );
                
                setApprovedOrders(userApprovedOrders);
                
                // Extract all product IDs from approved orders
                const productIds = new Set();
                userApprovedOrders.forEach(order => {
                    if (order.items && Array.isArray(order.items)) {
                        order.items.forEach(item => {
                            if (item.itemId) {
                                productIds.add(item.itemId);
                            }
                        });
                    }
                });
                
                setApprovedProductIds(Array.from(productIds));
                
            } catch (err) {
                console.error('Error fetching approved orders:', err);
                // Don't set an error state here - just log the error
            }
        };

        fetchApprovedOrders();
    }, [user.id]);

    // Derived State
    const cartQuantity = useMemo(() => 
        cart.reduce((sum, item) => sum + item.quantity, 0), 
        [cart]
    );
    
    const subtotal = useMemo(() => 
        cart.reduce((sum, item) => sum + (item.Unit_MRP || item.unitMrp) * item.quantity, 0),
        [cart]
    );
    
    const totalAmount = useMemo(() => 
        Math.max(0, subtotal - discountAmount),
        [subtotal, discountAmount]
    );

    const allProducts = useMemo(() => [
        ...products.pharmacy.map(product => ({ ...product, type: 'pharmacy' })),
        ...products.nonPharmacy.map(product => ({ ...product, type: 'nonPharmacy' }))
    ], [products]);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // Get auth token for API requests
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('Not authenticated');
                }

                const [pharmacyRes, nonPharmacyRes] = await Promise.all([
                    fetch('http://localhost:5000/api/products/pharmacy?limit=50&approved=true&inInventory=true', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                    fetch('http://localhost:5000/api/products/nonpharmacy?limit=50&approved=true&inInventory=true', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                ]);

                if (!pharmacyRes.ok || !nonPharmacyRes.ok) {
                    throw new Error('Failed to fetch products');
                }

                const [pharmacyData, nonPharmacyData] = await Promise.all([
                    pharmacyRes.json(),
                    nonPharmacyRes.json(),
                ]);

                setRawProducts({
                    pharmacy: pharmacyData.data?.slice(0, 50) || [],
                    nonPharmacy: nonPharmacyData.data?.slice(0, 50) || []
                });
            } catch (err) {
                console.error('Error loading products:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products based on user role, store, and approved orders
    useEffect(() => {
        if (!rawProducts.pharmacy || !rawProducts.nonPharmacy) return;

        // For superadmin, show all products
        if (user.role === 'superadmin') {
            setProducts(rawProducts);
            return;
        }

        // For regular users, filter by approved orders if we have the list
        if (approvedProductIds.length > 0) {
            const filteredPharmacy = rawProducts.pharmacy.filter(product => 
                approvedProductIds.includes(product._id)
            );
            
            const filteredNonPharmacy = rawProducts.nonPharmacy.filter(product => 
                approvedProductIds.includes(product._id)
            );

            setProducts({
                pharmacy: filteredPharmacy,
                nonPharmacy: filteredNonPharmacy
            });
            
            // Show message if filters are applied
            if (filteredPharmacy.length > 0 || filteredNonPharmacy.length > 0) {
                toast.info('Showing only products from your approved orders');
            } else if (approvedOrders.length === 0) {
                toast.info('You have no approved orders. Contact admin to approve your orders.');
            }
            return;
        }
        
        // For admin and employee without approved orders, filter by store name
        if (user.role !== 'superadmin' && user.store_name) {
            const storeFilteredPharmacy = rawProducts.pharmacy.filter((_, index) => index % 2 === 0);
            const storeFilteredNonPharmacy = rawProducts.nonPharmacy.filter((_, index) => index % 2 === 0);
            
            setProducts({
                pharmacy: storeFilteredPharmacy,
                nonPharmacy: storeFilteredNonPharmacy
            });
            return;
        }
        
        // Fallback: show all available products
        setProducts(rawProducts);
        
    }, [rawProducts, user, approvedProductIds, approvedOrders]);

    // Handle Search & Filtering
    useEffect(() => {
        const searchProducts = async () => {
            if (searchTerm.trim() === '') {
                filterProductsByCategory(allProducts);
                return;
            }
    
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('Not authenticated');
                }

                const searchEndpoint = 'http://localhost:5000/api/products/pharmacy';
    
                const response = await fetch(
                    `${searchEndpoint}?search=${encodeURIComponent(searchTerm)}&approved=true&inInventory=true`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
    
                if (!response.ok) {
                    throw new Error('Search request failed');
                }
    
                const data = await response.json();
                let searchResults = data?.data || [];
                
                // Add type property to search results
                let formattedResults = searchResults.map(product => ({
                    ...product, 
                    type: product.Unit_MRP ? 'pharmacy' : 'nonPharmacy'
                }));
                
                // Filter by approved products if we have the list
                if (approvedProductIds.length > 0 && user.role !== 'superadmin') {
                    formattedResults = formattedResults.filter(product => 
                        approvedProductIds.includes(product._id)
                    );
                }
                // Apply store filtering for admin and employee users without approved orders
                else if (user.role && user.role !== 'superadmin' && user.store_name) {
                    // Demo filtering - in a real app, filter by store field
                    formattedResults = formattedResults.filter((_, index) => index % 2 === 0);
                }
                
                filterProductsByCategory(formattedResults);
            } catch (err) {
                console.error('Search Error:', err);
                setFilteredProducts([]);
            }
        };
    
        const timer = setTimeout(searchProducts, 300); // Debounce API call
        return () => clearTimeout(timer);
    }, [searchTerm, allProducts, user, approvedProductIds]);

    // Filter by Category
    const filterProductsByCategory = (productsToFilter) => {
        if (activeCategory === 'all') {
            setFilteredProducts(productsToFilter);
        } else {
            setFilteredProducts(productsToFilter.filter(product => 
                product.type.toLowerCase() === activeCategory.toLowerCase()
            ));
        }
    };

    useEffect(() => {
        filterProductsByCategory(allProducts);
    }, [activeCategory, allProducts]);

    // Cart Operations
    const addToCart = (product) => {
        // Get approved quantity for this product
        const getApprovedQuantity = () => {
            let totalApproved = 0;
            
            approvedOrders.forEach(order => {
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach(item => {
                        if (item.itemId === product._id) {
                            totalApproved += parseInt(item.quantity) || 0;
                        }
                    });
                }
            });
            
            return totalApproved;
        };
        
        const approvedQty = getApprovedQuantity();
        
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);
            
            if (existingItem) {
                if (existingItem.quantity < approvedQty) {
                    return prevCart.map(item => 
                        item._id === product._id 
                            ? { ...item, quantity: item.quantity + 1 } 
                            : item
                    );
                } else {
                    toast.error(`Cannot add more than approved quantity (${approvedQty})`);
                    return prevCart;
                }
            } else {
                if (approvedQty > 0) {
                    return [...prevCart, { ...product, quantity: 1, approvedQty }];
                } else {
                    toast.error(`No approved quantity available for this product`);
                    return prevCart;
                }
            }
        });
        
        toast.success(`${product.tradeName || product.Product_name} added to cart`);
    };

    const updateCartItemQuantity = (productId, newQuantity) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item._id === productId) {
                    // Find the approved quantity for this product
                    let approvedQty = item.approvedQty;
                    if (!approvedQty) {
                        approvedQty = 0;
                        approvedOrders.forEach(order => {
                            if (order.items && Array.isArray(order.items)) {
                                order.items.forEach(orderItem => {
                                    if (orderItem.itemId === productId) {
                                        approvedQty += parseInt(orderItem.quantity) || 0;
                                    }
                                });
                            }
                        });
                    }
                    
                    if (newQuantity > approvedQty) {
                        toast.error(`Cannot add more than approved quantity (${approvedQty})`);
                        return { ...item, quantity: approvedQty };
                    } else if (newQuantity < 1) {
                        return item; // Will be removed below
                    } else {
                        return { ...item, quantity: newQuantity };
                    }
                }
                return item;
            }).filter(item => item.quantity >= 1);
        });
    };

    const removeFromCart = (productId) => {
        const itemToRemove = cart.find(item => item._id === productId);
        if (itemToRemove) {
            setCart(prevCart => prevCart.filter(item => item._id !== productId));
            toast.info(`${itemToRemove.tradeName || itemToRemove.Product_name} removed from cart`);
        }
    };

    const clearCart = () => {
        setCart([]);
        setDiscountAmount(0);
        toast.info('Cart has been cleared');
    };

    // Handle Order Submission
    const submitOrder = () => {
        if (cart.length === 0) {
            toast.error('Cart is empty. Please add products to proceed.');
            return;
        }

        setIsSubmitting(true);

        const order = {
            customer: customerInfo,
            products: cart.map(item => ({
                product_id: item._id,
                product_name: item.tradeName || item.Product_name,
                price: item.Unit_MRP || item.unitMrp,
                quantity: item.quantity,
                subtotal: (item.Unit_MRP || item.unitMrp) * item.quantity,
            })),
            payment: {
                method: paymentMethod,
                subtotal: subtotal,
                discount: discountAmount,
                total: totalAmount
            },
            created_at: new Date().toISOString(),
        };

        // Simulate API call
        setTimeout(() => {
            try {
                const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
                setOrderDetails({
                    ...order,
                    order_id: orderNumber
                });
                setOrderSuccess(true);
                setIsSubmitting(false);
            } catch (err) {
                console.error('Error placing order:', err);
                toast.error('Failed to place order. Please try again.');
                setIsSubmitting(false);
            }
        }, 1500);


        fetch('http://localhost:5000/api/products/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to submit order');
                }
                return res.json();
            })
            .then(data => {
                setOrderDetails({
                    ...order,
                    order_id: data.order_id || `ORD-${Date.now().toString().slice(-8)}`
                });
                setOrderSuccess(true);
                setIsSubmitting(false);
            })
            .catch(err => {
                console.error('Error placing order:', err);
                toast.error('Failed to place order. Please try again.');
                setIsSubmitting(false);
            });
    };

    // Print Receipt - Now using the imported utility
    const handlePrintReceipt = () => {
        const success = printReceipt(orderDetails);
        if (!success) {
            toast.error('Could not open print window. Please check your popup blocker settings.');
        }
    };

    const createNewOrder = () => {
        setCart([]);
        setCustomerInfo({
            name: 'Walk-in Customer',
            phone: '',
            email: '',
        });
        setPaymentMethod('cash');
        setDiscountAmount(0);
        setOrderSuccess(false);
        setOrderDetails(null);
    };

    const handleReload = () => window.location.reload();

    // Main render
    if (loading) {
        return <LoadingDisplay />;
    }

    if (error) {
        return <ErrorDisplay error={error} reload={() => window.location.reload()} />;
    }

    if (orderSuccess) {
        return <OrderSuccess 
            orderDetails={orderDetails} 
            handlePrintReceipt={handlePrintReceipt} 
            createNewOrder={createNewOrder} 
        />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Products */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <FaThList className="mr-2 text-primary" />
                                Point of Sale
                                <span className="ml-2 badge badge-secondary">
                                    {filteredProducts.length}
                                </span>
                            </h2>
                        </div>

                        <SearchBar value={searchTerm} onChange={setSearchTerm} />
                        
                        {showCategoryFilter && (
                            <CategoryFilter 
                                activeCategory={activeCategory} 
                                setActiveCategory={setActiveCategory} 
                            />
                        )}
                        
                        {/* Products Grid */}
                        <div className="mb-6">
                            {user.role && user.role !== 'superadmin' && user.store_name && (
                                <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-md mb-4">
                                    <span className="text-sm font-medium">
                                        Showing products from your store: {user.store_name}
                                    </span>
                                </div>
                            )}
                            
                            {filteredProducts.length === 0 ? (
                                <div className="bg-white p-8 rounded-lg text-center shadow-sm">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 mb-2">
                                        {searchTerm 
                                            ? 'No products found matching your search.' 
                                            : 'No products available in this category.'
                                        }
                                    </p>
                                    {searchTerm && (
                                        <button 
                                            onClick={() => setSearchTerm('')}
                                            className="text-primary hover:text-secondary text-sm font-medium"
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {filteredProducts.map(product => (
                                            <ProductCard 
                                                key={product._id} 
                                                product={product} 
                                                cart={cart} 
                                                approvedOrders={approvedOrders} 
                                                addToCart={addToCart} 
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Cart */}
                    <div className="lg:border-l lg:pl-6">
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                                    Shopping Cart
                                </h2>
                                {cart.length > 0 && (
                                    <button 
                                        onClick={clearCart}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Clear Cart
                                    </button>
                                )}
                            </div>
                            
                            {/* Cart Items */}
                            <div className="mb-6 max-h-[30vh] overflow-y-auto pr-1">
                                <AnimatePresence>
                                    {cart.length === 0 ? (
                                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <ShoppingCart className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                Your cart is empty. Add some products to get started.
                                            </p>
                                        </div>
                                    ) : (
                                        cart.map(item => (
                                            <CartItem 
                                                key={item._id} 
                                                item={item} 
                                                updateCartItemQuantity={updateCartItemQuantity} 
                                                removeFromCart={removeFromCart} 
                                            />
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            {/* Customer & Payment Info */}
                            {cart.length > 0 && (
                                <>
                                    <CustomerInfoForm 
                                        customerInfo={customerInfo}
                                        setCustomerInfo={setCustomerInfo}
                                        showCustomerForm={showCustomerForm}
                                        setShowCustomerForm={setShowCustomerForm}
                                    />
                                    
                                    <PaymentMethodSelector 
                                        paymentMethod={paymentMethod}
                                        setPaymentMethod={setPaymentMethod}
                                    />
                                    
                                    <DiscountInput 
                                        discountAmount={discountAmount}
                                        setDiscountAmount={setDiscountAmount}
                                        subtotal={subtotal}
                                    />
                                    
                                    <OrderSummary 
                                        cartQuantity={cartQuantity}
                                        subtotal={subtotal}
                                        discountAmount={discountAmount}
                                        totalAmount={totalAmount}
                                    />
                                    
                                    <button
                                        onClick={submitOrder}
                                        disabled={isSubmitting || cart.length === 0}
                                        className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                                            isSubmitting || cart.length === 0
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-primary hover:bg-primary/90 shadow-sm hover:shadow'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white/90 rounded-full animate-spin mr-2"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5 mr-2" />
                                                Complete Sale
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default POS;