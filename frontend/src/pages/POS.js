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
                    <title>Receipt - Order #${orderNumber}</title>
                    <style>
                        @media print {
                            @page { margin: 0; }
                            body { margin: 1cm; }
                        }
                        body {
                            font-family: 'Helvetica', 'Arial', sans-serif;
                            max-width: 300px;
                            margin: 0 auto;
                            padding: 10px;
                            color: #333;
                            line-height: 1.4;
                        }
                        .receipt {
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            padding: 15px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            background: #fff;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 15px;
                            padding-bottom: 15px;
                            border-bottom: 2px dashed #eee;
                        }
                        .logo {
                            font-size: 24px;
                            font-weight: bold;
                            margin-bottom: 5px;
                            color: #2563eb;
                        }
                        .store-info {
                            font-size: 12px;
                            color: #666;
                            margin-bottom: 10px;
                        }
                        .receipt-title {
                            font-size: 16px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            margin: 10px 0;
                        }
                        .order-info {
                            display: flex;
                            justify-content: space-between;
                            font-size: 12px;
                            margin-bottom: 15px;
                        }
                        .divider {
                            border-bottom: 1px dashed #eee;
                            margin: 10px 0;
                        }
                        .items-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 15px 0;
                        }
                        .items-table th {
                            text-align: left;
                            font-size: 12px;
                            padding: 5px 0;
                            border-bottom: 1px solid #ddd;
                            color: #666;
                        }
                        .items-table td {
                            padding: 8px 0;
                            font-size: 12px;
                            border-bottom: 1px dotted #eee;
                        }
                        .item-name {
                            max-width: 150px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .qty {
                            text-align: center;
                        }
                        .price, .subtotal {
                            text-align: right;
                        }
                        .summary {
                            margin-top: 15px;
                            font-size: 12px;
                        }
                        .total-row {
                            display: flex;
                            justify-content: space-between;
                            font-weight: bold;
                            font-size: 14px;
                            margin-top: 10px;
                            padding-top: 10px;
                            border-top: 2px solid #333;
                        }
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                            font-size: 11px;
                            color: #777;
                        }
                        .barcode {
                            text-align: center;
                            margin: 15px 0;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            letter-spacing: 2px;
                        }
                        .thank-you {
                            text-align: center;
                            font-size: 14px;
                            margin: 15px 0 5px;
                        }
                        .policies {
                            font-size: 10px;
                            color: #999;
                            text-align: center;
                            margin-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="header">
                            <div class="logo">QuickMeds</div>
                            <div class="store-info">
                                - Distributor -<br>
                                Phone: 74859 06699<br>
                                Email: info@quickmeds.com
                            </div>
                            <div class="receipt-title">Sales Receipt</div>
                        </div>
                        
                        <div class="order-info">
                            <div>
                                <strong>Order #:</strong> ${orderNumber}<br>
                                <strong>Customer:</strong> ${customerName}
                            </div>
                            <div>
                                <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
                                <strong>Time:</strong> ${new Date().toLocaleTimeString()}
                            </div>
                        </div>
                        
                        <div class="divider"></div>
                        
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th class="qty">Qty</th>
                                    <th class="price">Price</th>
                                    <th class="subtotal">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${cart.map(item => `
                                    <tr>
                                        <td class="item-name">${item.tradeName || item.Product_name}</td>
                                        <td class="qty">${item.quantity}</td>
                                        <td class="price">$${(item.Unit_MRP || item.unitMrp).toFixed(2)}</td>
                                        <td class="subtotal">$${((item.Unit_MRP || item.unitMrp) * item.quantity).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        
                        <div class="summary">
                            <div class="total-row">
                                <span>TOTAL</span>
                                <span>$${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div class="barcode">
                            *${orderNumber}*
                        </div>
                        
                        <div class="thank-you">Thank you for your purchase!</div>
                        
                        <div class="policies">
                            Return policy: Items may be returned within 7 days with receipt.<br>
                            Prescription medications cannot be returned once dispensed.
                        </div>
                        
                        <div class="footer">
                            Powered by QuickMeds System<br>
                            ${new Date().toISOString().split('T')[0]}
                        </div>
                    </div>
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
        <div className="min-h-screen bg-background pb-6">
        <motion.header className="bg-gray-900 text-white shadow-md p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <ShoppingCart className="h-6 w-6 text-yellow-400" />
                    <h1 className="text-xl font-bold text-white">Point of Sale</h1>
                </div>
                <div className="flex items-center space-x-2">
                    {cartQuantity > 0 && (
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-yellow-400 text-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        >
                            {cartQuantity}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.header>


            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <SearchBar 
                                value={searchTerm} 
                                onChange={setSearchTerm} 
                                placeholder="Search products by name..." 
                            />
                            
                            <CategoryFilter 
                                activeCategory={activeCategory} 
                                onCategoryChange={setActiveCategory} 
                                categories={[
                                    { id: 'All', name: 'All Products' },
                                    { id: 'Pharmacy', name: 'Pharmacy' },
                                    { id: 'Non-Pharmacy', name: 'Non-Pharmacy' }
                                ]} 
                            />

                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Available Products 
                                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                                        ({filteredProducts.length})
                                    </span>
                                </h2>
                            </div>

                            <div className="relative h-[calc(100vh-280px)] overflow-y-auto pr-1">
                                {filteredProducts.length === 0 ? (
                                    <div className="glass-panel rounded-xl p-8 text-center">
                                        <p className="text-muted-foreground">
                                            {searchTerm ? 
                                                'No products found. Try a different search term.' : 
                                                'No products available in this category.'
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
                        className="glass-panel rounded-xl border border-border/50 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold flex items-center">
                                <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                                Shopping Cart
                            </h2>
                            {cart.length > 0 && (
                                <button 
                                    onClick={clearCart} 
                                    className="text-xs px-2 py-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors duration-200"
                                >
                                    Clear cart
                                </button>
                            )}
                        </div>
                        
                        <div className="mb-6">
                            <label className="text-sm font-medium text-foreground">
                                Customer Name
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                                className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                placeholder="Enter customer name"
                            />
                        </div>
                        
                        <div className="h-[calc(100vh-410px)] overflow-y-auto pr-1 mb-6">
                            <AnimatePresence>
                                {cart.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground">
                                            Your cart is empty.
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Add products to get started.
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

                        <div className="mt-auto pt-4 border-t border-border">
                            <div className="flex justify-between items-baseline text-lg mb-6">
                                <span className="font-medium">Total</span>
                                <span className="font-bold">${totalAmount.toFixed(2)}</span>
                            </div>
                            
                            <button
                                onClick={submitOrder}
                                disabled={cart.length === 0 || isSubmitting}
                                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                                    cart.length === 0 || isSubmitting
                                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
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
                                        Submit Order
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default POS;