import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { toast } from 'sonner';

const POSContext = createContext();

export const usePOSContext = () => useContext(POSContext);

export const POSProvider = ({ children }) => {
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
    const [user, setUser] = useState({ role: '', store_name: '', id: '' });
    const [storeInventory, setStoreInventory] = useState([]);

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

    // Derived State
    const cartQuantity = useMemo(() =>
        cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );

    const subtotal = useMemo(() =>
        cart.reduce((sum, item) => sum + (item.Unit_MRP || item.unitMrp) * item.quantity, 0),
        [cart]
    );

    // No discount, total is same as subtotal
    const totalAmount = subtotal;

    const allProducts = useMemo(() => [
        ...products.pharmacy.map(product => ({ ...product, type: 'pharmacy' })),
        ...products.nonPharmacy.map(product => ({ ...product, type: 'nonPharmacy' }))
    ], [products]);

    // Fetch Store Inventory
    useEffect(() => {
        const fetchStoreInventory = async () => {
            if (!user.store_name) {
                console.log("No store name found in user profile");
                setError("Your account is not linked to a store. Please contact admin.");
                setLoading(false);
                return;
            }
            
            console.log(`Fetching inventory for store: ${user.store_name}`);
            setLoading(true);
            
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }

                // First try store-specific endpoint (ideal case)
                console.log(`Attempting store-specific inventory endpoint for ${user.store_name}`);
                let response = await fetch(`http://localhost:5000/api/inventory/store/${encodeURIComponent(user.store_name)}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    // If that fails, try the pharmacy orders endpoint and filter for the store
                    console.log(`Store-specific endpoint failed, trying orders endpoint`);
                    response = await fetch(`http://localhost:5000/api/orders/pharmacy`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch inventory (Status: ${response.status})`);
                    }
                    
                    const ordersData = await response.json();
                    console.log(`Received ${ordersData.length} orders, filtering for ${user.store_name}`);
                    
                    // Filter for this store and approved status
                    const storeOrders = ordersData.filter(order => {
                        const orderStore = order.store_name || order.storeName;
                        return orderStore === user.store_name && 
                               order.status === 'approved';
                    });
                    
                    console.log(`Found ${storeOrders.length} approved orders for ${user.store_name}`);
                    
                    // Extract inventory items from these orders
                    const inventoryItems = [];
                    storeOrders.forEach(order => {
                        if (order.items && Array.isArray(order.items)) {
                            order.items.forEach(item => {
                                const existingItem = inventoryItems.find(i => i.product_id === item.itemId);
                                
                                if (existingItem) {
                                    // Add to existing quantity
                                    existingItem.quantity = (parseInt(existingItem.quantity) || 0) + 
                                                          (parseInt(item.quantity) || 0);
                                } else {
                                    // Add as new item
                                    inventoryItems.push({
                                        product_id: item.itemId,
                                        quantity: parseInt(item.quantity) || 0,
                                        store_name: user.store_name,
                                        created_at: order.createdAt || order.created_at
                                    });
                                }
                            });
                        }
                    });
                    
                    setStoreInventory(inventoryItems);
                    console.log(`Extracted ${inventoryItems.length} inventory items from orders`);
                    
                    if (inventoryItems.length > 0) {
                        toast.success(`Found ${inventoryItems.length} products for ${user.store_name}`);
                    } else {
                        toast.info(`No approved products found for ${user.store_name}`);
                    }
                    
                    return; // Skip the rest of the function
                }

                // Handle successful store inventory response
                const inventoryData = await response.json();
                const inventoryItems = inventoryData.data || [];
                
                // Ensure filtering by store name in case API returns multiple stores
                const storeItems = inventoryItems.filter(item => 
                    item.store_name === user.store_name || 
                    item.storeName === user.store_name
                );
                
                setStoreInventory(storeItems);
                
                console.log(`Loaded ${storeItems.length} inventory items for ${user.store_name}`);
                
                if (storeItems.length > 0) {
                    toast.success(`Loaded ${storeItems.length} products for ${user.store_name}`);
                } else {
                    toast.info(`No inventory items found for ${user.store_name}`);
                }
                
            } catch (err) {
                console.error('Error fetching store inventory:', err);
                toast.error(`Inventory error: ${err.message}`);
                setError(`Failed to load inventory for ${user.store_name}. Using product catalog instead.`);
                
                // Set empty inventory to fall back to raw products
                setStoreInventory([]);
            } finally {
                setLoading(false);
            }
        };

        if (user.store_name) {
            fetchStoreInventory();
        } else {
            setError("Store not found in your profile. Please contact admin.");
            setLoading(false);
        }
    }, [user.store_name]);

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
                    fetch('http://localhost:5000/api/products/pharmacy?limit=100', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                    fetch('http://localhost:5000/api/products/nonpharmacy?limit=100', {
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

                const pharProducts = pharmacyData.data?.slice(0, 100) || [];
                const nonPharProducts = nonPharmacyData.data?.slice(0, 100) || [];

                // Process inventory if we have it
                if (storeInventory.length > 0) {
                    processInventoryItems(pharProducts, nonPharProducts);
                    console.log("Processing with store inventory");
                } else {
                    // Otherwise, use all products with default stock of 10
                    console.log("Using full product catalog with default stock");
                    const defaultStock = 10;

                    setProducts({
                        pharmacy: pharProducts.map(p => ({
                            ...p,
                            stock: p.stock || defaultStock,
                            addedAt: p.createdAt || new Date().toISOString()
                        })),
                        nonPharmacy: nonPharProducts.map(p => ({
                            ...p,
                            stock: p.stock || defaultStock,
                            addedAt: p.createdAt || new Date().toISOString()
                        }))
                    });

                    toast.success(`Loaded ${pharProducts.length + nonPharProducts.length} products`);
                    // Clear any previous errors
                    if (error) setError(null);
                }

            } catch (err) {
                console.error('Error loading products:', err);
                setError('Failed to load products. Please try again.');
                toast.error(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [storeInventory, error]);

    // Process inventory items with product details
    const processInventoryItems = (pharProducts, nonPharProducts) => {
        try {
            // If no inventory items from store, don't process anything
            if (storeInventory.length === 0) {
                console.log("No store inventory items to process");
                return;
            }

            console.log(`Processing ${storeInventory.length} inventory items for ${user.store_name}`);
            
            // Create inventory items with product details
            const pharmacyItems = [];
            const nonPharmacyItems = [];
            let missingProducts = 0;
            
            storeInventory.forEach(item => {
                // Find product details - first in pharmacy
                let product = pharProducts.find(p => p._id === item.product_id);
                let type = 'pharmacy';
                
                // If not found in pharmacy, look in non-pharmacy
                if (!product) {
                    product = nonPharProducts.find(p => p._id === item.product_id);
                    type = 'nonPharmacy';
                }
                
                if (product) {
                    // Add inventory details to product
                    const inventoryProduct = {
                        ...product,
                        stock: item.quantity || 0,
                        addedAt: item.created_at || new Date().toISOString(),
                        store_name: user.store_name
                    };
                    
                    // Add to appropriate array
                    if (type === 'pharmacy') {
                        pharmacyItems.push(inventoryProduct);
                    } else {
                        nonPharmacyItems.push(inventoryProduct);
                    }
                } else {
                    missingProducts++;
                }
            });
            
            if (missingProducts > 0) {
                console.warn(`${missingProducts} inventory items could not be matched with products`);
            }
            
            // Update the products state with the processed inventory items
            setProducts({
                pharmacy: pharmacyItems,
                nonPharmacy: nonPharmacyItems
            });
            
            console.log(`Processed ${pharmacyItems.length} pharmacy and ${nonPharmacyItems.length} non-pharmacy items for ${user.store_name}`);
            
            // If we have very few products, show a warning
            if (pharmacyItems.length + nonPharmacyItems.length < 3) {
                toast.warning(`Only ${pharmacyItems.length + nonPharmacyItems.length} products found for ${user.store_name}`);
            }
            
        } catch (err) {
            console.error('Error processing inventory items:', err);
            setError('Failed to process inventory items for your store.');
        }
    };

    // Handle Search & Filtering
    useEffect(() => {
        const searchProducts = async () => {
            if (searchTerm.trim() === '') {
                filterProductsByCategory(allProducts);
                return;
            }

            // First try to search in local inventory
            const localResults = allProducts.filter(product => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    (product.tradeName && product.tradeName.toLowerCase().includes(searchLower)) ||
                    (product.Product_name && product.Product_name.toLowerCase().includes(searchLower)) ||
                    (product.category && product.category.toLowerCase().includes(searchLower)) ||
                    (product.Category && product.Category.toLowerCase().includes(searchLower)) ||
                    (product.company && product.company.toLowerCase().includes(searchLower)) ||
                    (product.Company && product.Company.toLowerCase().includes(searchLower))
                );
            });

            if (localResults.length > 0) {
                filterProductsByCategory(localResults);
                return;
            }

            // If no local results and we have at least some products already, 
            // don't make a server request to avoid mixing inventory/non-inventory items
            if (allProducts.length > 10) {
                filterProductsByCategory([]);
                return;
            }

            // Only do server search if we have very few products
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('Not authenticated');
                }

                const searchEndpoint = 'http://localhost:5000/api/products/pharmacy';

                const response = await fetch(
                    `${searchEndpoint}?search=${encodeURIComponent(searchTerm)}`,
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
                const formattedResults = searchResults.map(product => ({
                    ...product,
                    type: product.Unit_MRP ? 'pharmacy' : 'nonPharmacy',
                    stock: product.stock || 10,  // Default stock
                    addedAt: product.createdAt || new Date().toISOString()
                }));

                filterProductsByCategory(formattedResults);
            } catch (err) {
                console.error('Search Error:', err);
                setFilteredProducts([]);
            }
        };

        const timer = setTimeout(searchProducts, 300); // Debounce API call
        return () => clearTimeout(timer);
    }, [searchTerm, allProducts]);

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
        // Check product stock
        const stock = parseInt(product.stock || 0);

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);

            if (existingItem) {
                if (existingItem.quantity < stock) {
                    return prevCart.map(item =>
                        item._id === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    toast.error(`Cannot add more than available stock (${stock})`);
                    return prevCart;
                }
            } else {
                if (stock > 0) {
                    return [...prevCart, { ...product, quantity: 1 }];
                } else {
                    toast.error(`Product is out of stock`);
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
                    // Check product stock
                    const stock = parseInt(item.stock || 0);

                    if (newQuantity > stock) {
                        toast.error(`Cannot add more than available stock (${stock})`);
                        return { ...item, quantity: stock };
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
                total: totalAmount
            },
            created_at: new Date().toISOString(),
            store_name: user.store_name,
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
        if (window.printReceipt) {
            const success = window.printReceipt(orderDetails);
            if (!success) {
                toast.error('Could not open print window. Please check your popup blocker settings.');
            }
        } else {
            toast.error('Print functionality not available.');
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
        setOrderSuccess(false);
        setOrderDetails(null);
    };

    const handleReload = () => window.location.reload();

    const value = {
        // State
        products,
        filteredProducts,
        cart,
        searchTerm,
        activeCategory,
        customerInfo,
        paymentMethod,
        isSubmitting,
        orderSuccess,
        orderDetails,
        loading,
        error,
        showCustomerForm,
        showCategoryFilter,
        user,
        storeInventory,

        // Derived state
        cartQuantity,
        subtotal,
        totalAmount,

        // Methods
        setSearchTerm,
        setActiveCategory,
        setCustomerInfo,
        setPaymentMethod,
        setShowCustomerForm,
        setShowCategoryFilter,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        submitOrder,
        handlePrintReceipt,
        createNewOrder,
        handleReload,
        filterProductsByCategory
    };

    return (
        <POSContext.Provider value={value}>
            {children}
        </POSContext.Provider>
    );
};

export default POSContext; 