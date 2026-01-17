import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiDownload, FiRefreshCw, FiSearch, FiFilter, FiGrid } from 'react-icons/fi';

// API URL
const API_URL = 'http://localhost:5000/api';

// Toast IDs to prevent duplicates
const TOAST_IDS = {
    LOAD_SUCCESS: 'load-products-success',
    LOAD_ERROR: 'load-products-error',
    REFRESH: 'refresh-products'
};

const formatStock = (stock) => {
    const stockNum = parseInt(stock) || 0;
    if (stockNum === 0) {
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Out of Stock</span>;
    } else if (stockNum <= 10) {
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">{stockNum} (Low)</span>;
    } else {
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">{stockNum}</span>;
    }
};

// Format price to Indian Rupees
const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return numPrice.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });
};

const AllProductsInventory = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [companyFilter, setCompanyFilter] = useState('');
    
    // Get user info from localStorage
    useEffect(() => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUserInfo(parsedUser);
            }
        } catch (err) {
            console.error('Error loading user data from localStorage:', err);
        }
    }, []);
    
    // Show toast with ID to prevent duplicates
    const showToast = (type, message, id) => {
        // Clear any existing toasts with this ID
        toast.dismiss(id);
        
        // Show the toast with the ID
        switch (type) {
            case 'success':
                toast.success(message, { toastId: id });
                break;
            case 'error':
                toast.error(message, { toastId: id });
                break;
            case 'info':
                toast.info(message, { toastId: id });
                break;
            default:
                toast.info(message, { toastId: id });
        }
    };
    
    // Fetch all products
    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }
            
            // Fetch pharmacy products
            const pharmaResponse = await fetch(`${API_URL}/products/pharmacy?limit=100`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Fetch non-pharmacy products
            const nonPharmaResponse = await fetch(`${API_URL}/products/nonpharmacy?limit=100`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!pharmaResponse.ok || !nonPharmaResponse.ok) {
                throw new Error('Failed to fetch products');
            }
            
            const pharmaData = await pharmaResponse.json();
            const nonPharmaData = await nonPharmaResponse.json();
            
            const pharmaProducts = pharmaData.data || [];
            const nonPharmaProducts = nonPharmaData.data || [];
            
            // Combine and normalize products
            const allProducts = [
                ...pharmaProducts.map(product => ({
                    ...product,
                    id: product._id,
                    name: product.tradeName || product.Product_name,
                    category: product.category || product.Category || 'Pharmacy',
                    company: product.company || product.Company || 'Unknown',
                    stock: product.stock || Math.floor(Math.random() * 30), // Default random stock for demo
                    price: product.unitMrp || product.Unit_MRP || 0,
                    type: 'pharmacy'
                })),
                ...nonPharmaProducts.map(product => ({
                    ...product,
                    id: product._id,
                    name: product.tradeName || product.Product_name,
                    category: product.category || product.Category || 'Non-Pharmacy',
                    company: product.company || product.Company || 'Unknown',
                    stock: product.stock || Math.floor(Math.random() * 30), // Default random stock for demo
                    price: product.unitMrp || product.Unit_MRP || 0,
                    type: 'nonpharmacy'
                }))
            ];
            
            // Extract unique categories and companies
            const uniqueCategories = [...new Set(allProducts.map(p => p.category))].filter(Boolean);
            const uniqueCompanies = [...new Set(allProducts.map(p => p.company))].filter(Boolean);
            
            setCategories(uniqueCategories.sort());
            setCompanies(uniqueCompanies.sort());
            setProducts(allProducts);
            setFilteredProducts(allProducts);
            
            showToast('success', `Loaded ${allProducts.length} products`, TOAST_IDS.LOAD_SUCCESS);
            
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
            showToast('error', `Failed to load products: ${err.message}`, TOAST_IDS.LOAD_ERROR);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetch products when component mounts
    useEffect(() => {
        // Close any existing toasts before fetching
        toast.dismiss();
        fetchProducts();
        
        // Clean up toasts when component unmounts
        return () => {
            toast.dismiss();
        };
    }, []);
    
    // Filter products when search term or filters change
    useEffect(() => {
        let results = [...products];
        
        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            results = results.filter(product => 
                (product.name && product.name.toLowerCase().includes(searchLower)) ||
                (product.category && product.category.toLowerCase().includes(searchLower)) ||
                (product.company && product.company.toLowerCase().includes(searchLower))
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
        
        setFilteredProducts(results);
    }, [searchTerm, categoryFilter, companyFilter, products]);
    
    // Handle refresh button click
    const handleRefresh = () => {
        // Dismiss existing toasts first
        toast.dismiss();
        showToast('info', "Refreshing products...", TOAST_IDS.REFRESH);
        fetchProducts();
    };
    
    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setCompanyFilter('');
    };
    
    return (
        <div className="space-y-6">
            {/* Header with title and actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Complete Product Inventory</h1>
                    <p className="text-sm text-gray-500">Showing all products ({filteredProducts.length} of {products.length})</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="btn btn-outline btn-sm gap-2"
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <FiRefreshCw className="h-4 w-4" />
                        )}
                        Refresh
                    </button>
                    <button className="btn btn-primary btn-sm gap-2">
                        <FiDownload className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>
            
            {/* Filter section */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products by name, category or company..."
                                className="input input-bordered w-full pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="select select-bordered w-full md:w-48"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <select
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="select select-bordered w-full md:w-48"
                        >
                            <option value="">All Companies</option>
                            {companies.map((company, index) => (
                                <option key={index} value={company}>{company}</option>
                            ))}
                        </select>
                        <button 
                            onClick={clearFilters}
                            className="btn btn-ghost btn-sm"
                            disabled={!searchTerm && !categoryFilter && !companyFilter}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Error message */}
            {error && (
                <div className="bg-red-50 p-4 rounded-lg text-red-800 mb-4">
                    <p className="font-semibold">Error loading products</p>
                    <p>{error}</p>
                    <button 
                        className="mt-2 btn btn-sm btn-outline text-red-600 hover:bg-red-100"
                        onClick={fetchProducts}
                    >
                        Try Again
                    </button>
                </div>
            )}
            
            {/* Products table */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center shadow-md">
                    <h3 className="text-xl font-bold mb-2">No Products Found</h3>
                    <p className="text-gray-600">
                        {searchTerm || categoryFilter || companyFilter ? 
                            "No products match your current filters. Try changing your search criteria." :
                            "There are no products in the inventory yet."
                        }
                    </p>
                    {(searchTerm || categoryFilter || companyFilter) && (
                        <button 
                            className="mt-4 btn btn-primary"
                            onClick={clearFilters}
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left">#</th>
                                    <th className="text-left">Product Name</th>
                                    <th className="text-left">Category</th>
                                    <th className="text-left">Company</th>
                                    <th className="text-center">Stock</th>
                                    <th className="text-right">Price (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="text-left">{index + 1}</td>
                                        <td className="text-left font-medium">
                                            {product.name || 'Unnamed Product'}
                                        </td>
                                        <td className="text-left">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                product.type === 'pharmacy' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="text-left">{product.company}</td>
                                        <td className="text-center">{formatStock(product.stock)}</td>
                                        <td className="text-right font-semibold">
                                            {formatPrice(product.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Totals and Stats */}
            {!isLoading && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-blue-900 text-lg font-medium">Total Products</h3>
                        <p className="text-3xl font-bold text-blue-700">{products.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-green-900 text-lg font-medium">In Stock</h3>
                        <p className="text-3xl font-bold text-green-700">
                            {products.filter(p => parseInt(p.stock) > 0).length}
                        </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-yellow-900 text-lg font-medium">Low Stock</h3>
                        <p className="text-3xl font-bold text-yellow-700">
                            {products.filter(p => parseInt(p.stock) > 0 && parseInt(p.stock) <= 10).length}
                        </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-red-900 text-lg font-medium">Out of Stock</h3>
                        <p className="text-3xl font-bold text-red-700">
                            {products.filter(p => parseInt(p.stock) === 0).length}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProductsInventory; 