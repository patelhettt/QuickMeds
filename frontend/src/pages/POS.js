import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, Printer, Save } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import CartItem from '../components/CartItem';
import CategoryFilter from '../components/CategoryFilter';
import OrderSuccess from '../components/OrderSuccess';
import { useMemo } from "react";
import { toast } from 'sonner';

const POS = () => {
    const [pharmacyProducts, setPharmacyProducts] = useState([]);
    const [nonPharmacyProducts, setNonPharmacyProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [customerName, setCustomerName] = useState('Walk-in Customer');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cartQuantity = useMemo(() => 
        cart.reduce((sum, item) => sum + item.quantity, 0), 
        [cart]
    );

    // Fetch Initial Limited Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const [pharmacyRes, nonPharmacyRes] = await Promise.all([
                    fetch('http://localhost:5000/api/products/pharmacy?limit=50'),
                    fetch('http://localhost:5000/api/products/nonpharmacy?limit=50'),
                ]);

                if (!pharmacyRes.ok || !nonPharmacyRes.ok) {
                    throw new Error('Failed to fetch products');
                }

                const [pharmacyData, nonPharmacyData] = await Promise.all([
                    pharmacyRes.json(),
                    nonPharmacyRes.json(),
                ]);

                setPharmacyProducts(pharmacyData.data?.slice(0, 50) || []);
                setNonPharmacyProducts(nonPharmacyData.data?.slice(0, 50) || []);
            } catch (err) {
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const searchProducts = async () => {
            if (searchTerm.trim() === '') {
                setSearchResults([]);
                return;
            }
    
            try {
                const searchEndpoint = 'http://localhost:5000/api/products/pharmacy?all=true/';
    
                const response = await fetch(
                    `${searchEndpoint}?q=${encodeURIComponent(searchTerm)}`
                );
    
                if (!response.ok) {
                    throw new Error('Search request failed');
                }
    
                const data = await response.json();
                setSearchResults(data || []); // Ensure correct data handling
            } catch (err) {
                console.error('Search Error:', err);
                setSearchResults([]);
            }
        };
    
        const timer = setTimeout(searchProducts, 300); // Debounce API call
    
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const combinedProducts = [
            ...pharmacyProducts.map(product => ({ ...product, type: 'Pharmacy' })),
            ...nonPharmacyProducts.map(product => ({ ...product, type: 'Non-Pharmacy' })),
        ];
    
        if (searchTerm.trim() !== '' && Array.isArray(searchResults) && searchResults.length > 0) {
            setFilteredProducts(searchResults.map(product => ({
                ...product,
                type: product.type || (product.Unit_MRP ? 'Pharmacy' : 'Non-Pharmacy')
            })));
        } else {
            setAllProducts(combinedProducts);
            setFilteredProducts(combinedProducts);
        }
    }, [pharmacyProducts, nonPharmacyProducts, searchResults, searchTerm]);
    
    // Filter Products Based on Category
    useEffect(() => {
        let filtered = searchTerm.trim() !== '' && Array.isArray(searchResults) ? [...searchResults] : [...allProducts];
    
        if (activeCategory !== 'All') {
            filtered = filtered.filter(product => product.type === activeCategory);
        }
    
        setFilteredProducts(filtered);
    }, [searchTerm, activeCategory, allProducts, searchResults]);

    // Calculate Total Amount Whenever Cart Changes
    useEffect(() => {
        calculateTotal(cart);
    }, [cart]);

    const calculateTotal = (cartItems) => {
        const total = cartItems.reduce((sum, item) => sum + (item.Unit_MRP || item.unitMrp) * item.quantity, 0);
        setTotalAmount(total);
    };

    const addToCart = (product) => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item._id === product._id && item.quantity < (product.Stock || product.stock)
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ).concat(!prevCart.some(item => item._id === product._id) ? [{ ...product, quantity: 1 }] : []);
        });
    };

    const increaseQuantity = (productId) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item._id === productId) {
                    const product = allProducts.find(p => p._id === productId) || 
                                  searchResults.find(p => p._id === productId);
                    if (item.quantity < (product.Stock || product.stock)) {
                        return { ...item, quantity: item.quantity + 1 };
                    } else {
                        toast.error(`${item.tradeName || item.Product_name} is out of stock`);
                    }
                }
                return item;
            });
        });
    };

    const decreaseQuantity = (productId) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item._id === productId && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
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
        setTotalAmount(0);
        toast.info('Cart has been cleared');
    };

    const submitOrder = () => {
        if (cart.length === 0) {
            toast.error('Cart is empty. Please add products to proceed.');
            return;
        }

        setIsSubmitting(true);

        const orderDetails = {
            customer_name: customerName,
            products: cart.map(item => ({
                product_id: item._id,
                product_name: item.tradeName || item.Product_name,
                price: item.Unit_MRP || item.unitMrp,
                quantity: item.quantity,
                subtotal: (item.Unit_MRP || item.unitMrp) * item.quantity,
            })),
            total_amount: totalAmount,
            created_at: new Date(),
        };

        fetch('http://localhost:5000/api/products/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to submit order');
                }
                return res.json();
            })
            .then(data => {
                setOrderSuccess(true);
                setOrderNumber(data.order_id || Date.now().toString().slice(-8));
                setIsSubmitting(false);
            })
            .catch(err => {
                console.error('Error placing order:', err);
                toast.error('Failed to place order. Please try again.');
                setIsSubmitting(false);
            });
    };

    const printReceipt = () => {
        const receiptWindow = window.open('', '_blank');
        
        if (receiptWindow) {
            receiptWindow.document.write(`
                <html>
                <head>
                    <title>Receipt</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            max-width: 300px;
                            margin: auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 10px;
                            text-align: center;
                            background: #fff;
                        }
                        h1 {
                            font-size: 24px;
                            margin-bottom: 10px;
                            color: #333;
                        }
                        h2 {
                            font-size: 18px;
                            margin-top: 15px;
                            color: #555;
                        }
                        p {
                            font-size: 14px;
                            margin: 5px 0;
                            color: #444;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                        }
                        li {
                            font-size: 14px;
                            display: flex;
                            justify-content: space-between;
                            border-bottom: 1px dashed #ddd;
                            padding: 5px 0;
                        }
                        .total {
                            font-size: 16px;
                            font-weight: bold;
                            margin-top: 15px;
                            padding-top: 10px;
                            border-top: 2px solid #000;
                        }
                        .footer {
                            font-size: 12px;
                            margin-top: 10px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <h1>🛒 RECEIPT</h1>
                    <p><strong>Order #:</strong> ${orderNumber}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Customer:</strong> ${customerName}</p>
                    <h2>Items</h2>
                    <ul>
                        ${cart.map(item => `
                            <li>
                                <span>${item.tradeName || item.Product_name} x ${item.quantity}</span>
                                <span>$${((item.Unit_MRP || item.unitMrp) * item.quantity).toFixed(2)}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <p class="total">Total: $${totalAmount.toFixed(2)}</p>
                    <p class="footer">Thank you for your purchase! 🎉</p>
                </body>
                </html>
            `);
            
            receiptWindow.document.close();
            receiptWindow.print();
        } else {
            alert('Could not open print window. Please check your popup blocker settings.');
        }
    };

    const createNewOrder = () => {
        setCart([]);
        setTotalAmount(0);
        setCustomerName('Walk-in Customer');
        setOrderSuccess(false);
        setOrderNumber(null);
    };

    if (loading && allProducts.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
                <div className="glass-panel rounded-xl p-8 text-center shadow-sm max-w-md w-full">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-primary/20 mb-6"></div>
                        <div className="h-8 bg-secondary w-3/4 rounded-md mb-4"></div>
                        <div className="h-4 bg-secondary w-1/2 rounded-md"></div>
                    </div>
                    <p className="mt-8 text-muted-foreground">Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
                <div className="glass-panel rounded-xl p-8 text-center shadow-sm max-w-md w-full">
                    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-10 w-10 text-destructive" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-4 text-foreground">{error}</h2>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 py-2 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-background">
                <OrderSuccess 
                    orderNumber={orderNumber} 
                    onPrintReceipt={printReceipt} 
                    onNewOrder={createNewOrder} 
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
            <motion.header className="bg-primary/95 text-white shadow-lg p-4 sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <ShoppingCart className="h-6 w-6 text-white/90" />
                        <h1 className="text-xl font-bold text-white">QuickMeds POS</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {cartQuantity > 0 && (
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-white text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            >
                                {cartQuantity}
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <SearchBar 
                                        value={searchTerm} 
                                        onChange={setSearchTerm} 
                                        placeholder="Search medicines and products..." 
                                    />
                                </div>
                                <CategoryFilter 
                                    activeCategory={activeCategory} 
                                    onCategoryChange={setActiveCategory} 
                                    categories={[
                                        { id: 'All', name: 'All Products' },
                                        { id: 'Pharmacy', name: 'Medicines' },
                                        { id: 'Non-Pharmacy', name: 'Other Items' }
                                    ]} 
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-foreground/90">
                                    Available Products 
                                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                                        ({filteredProducts.length})
                                    </span>
                                </h2>
                            </div>

                            <div className="relative h-[calc(100vh-240px)] overflow-y-auto rounded-xl">
                                {filteredProducts.length === 0 ? (
                                    <div className="glass-panel rounded-xl p-8 text-center bg-card/50 backdrop-blur-sm">
                                        <p className="text-muted-foreground">
                                            {searchTerm ? 
                                                'No products found. Try a different search term.' : 
                                                'No products available in this category.'
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-1">
                                        {filteredProducts.map(product => (
                                            <ProductCard 
                                                key={product._id} 
                                                product={product} 
                                                onAddToCart={addToCart} 
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="lg:col-span-4 h-fit sticky top-24"
                    >
                        <div className="glass-panel rounded-xl border border-border/50 shadow-lg p-6 bg-card/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold flex items-center text-foreground/90">
                                    <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                                    Cart Summary
                                </h2>
                                {cart.length > 0 && (
                                    <button 
                                        onClick={clearCart} 
                                        className="text-xs px-3 py-1.5 text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-full transition-colors duration-200"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            
                            <div className="mb-6">
                                <label className="text-sm font-medium text-foreground/90 mb-1.5 block">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                    placeholder="Enter customer name"
                                />
                            </div>
                            
                            <div className="h-[calc(100vh-460px)] overflow-y-auto pr-1 mb-6">
                                <AnimatePresence>
                                    {cart.length === 0 ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-8"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                                                <ShoppingCart className="h-8 w-8 text-primary/60" />
                                            </div>
                                            <p className="text-foreground/80 font-medium">
                                                Your cart is empty
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Add products to begin
                                            </p>
                                        </motion.div>
                                    ) : (
                                        cart.map(item => (
                                            <CartItem
                                                key={item._id}
                                                item={item}
                                                onIncrease={increaseQuantity}
                                                onDecrease={decreaseQuantity}
                                                onRemove={removeFromCart}
                                            />
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="mt-auto pt-4 border-t border-border/50">
                                <div className="flex justify-between items-baseline text-lg mb-6">
                                    <span className="font-medium text-foreground/90">Total Amount</span>
                                    <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span>
                                </div>
                                
                                <button
                                    onClick={submitOrder}
                                    disabled={cart.length === 0 || isSubmitting}
                                    className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                                        cart.length === 0 || isSubmitting
                                            ? 'bg-muted cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:shadow-primary/20'
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
                                            Complete Order
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default POS;