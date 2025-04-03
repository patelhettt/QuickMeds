import React, { useState, useEffect } from 'react';
import SaveButton from '../../../components/buttons/SaveButton';
import CancelButton from '../../../components/buttons/CancelButton';
import PrintButton from '../../../components/buttons/PrintButton';
import NewButton from '../../../components/buttons/NewButton';
import SearchButton from '../../../components/buttons/SearchButton';
import RefreshButton from '../../../components/buttons/RefreshButton';
import Input from '../../../components/form/Input';
import ModalCloseButton from '../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../components/headings/ModalHeading';
import TableRow from '../../../components/TableRow';
import { toast } from 'react-toastify';
import DashboardPageHeading from '../../../components/headings/DashboardPageHeading';
import axios from 'axios';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

const PharmacyItems = () => {
    // State for items and pagination
    const [pharmacyItems, setPharmacyItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    // State for search
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    // State for order creation
    const [selectedItems, setSelectedItems] = useState([]);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderNote, setOrderNote] = useState('');
    
    // State for item request
    const [requestingItem, setRequestingItem] = useState(null);
    const [requestQuantity, setRequestQuantity] = useState(1);
    
    // API and auth
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{"_id":"user123","store_name":"Main Store"}');

    // Table headers
    const tableHeadItems = ['SN', 'Product Name', 'Category', 'Strength', 'Company', 'Stock', 'Actions'];

    // Fetch items with pagination and optional search
    const fetchItems = async (page = 1, limit = itemsPerPage, search = '') => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/api/products/pharmacy?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            
            const data = response.data;
            setPharmacyItems(data.data || []);
            setTotalItems(data.totalItems || 0);
            setTotalPages(data.totalPages || 0);
            
            if (search && data.totalItems === 0) {
                toast.info(`No products found matching "${search}"`);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            toast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchItems(currentPage);
    }, [currentPage]);

    // Handle search toggle
    const handleSearchToggle = () => {
        setIsSearching(!isSearching);
    };

    // Handle search submission
    const handleSearch = (event) => {
        event.preventDefault();
        setCurrentPage(1); // Reset to first page
        fetchItems(1, itemsPerPage, searchTerm);
        setIsSearching(false);
    };

    // Handle requesting an item
    const handleRequestItem = (item) => {
        setRequestingItem(item);
        setRequestQuantity(1);
        document.getElementById('request-item-modal').checked = true;
    };

    // Add item to order
    const addToOrder = (item, quantity) => {
        const existingItemIndex = selectedItems.findIndex(i => i.itemId === item._id);
        
        if (existingItemIndex >= 0) {
            const updatedItems = [...selectedItems];
            updatedItems[existingItemIndex].quantity = quantity;
            setSelectedItems(updatedItems);
        } else {
            setSelectedItems([
                ...selectedItems,
                {
                    itemId: item._id,
                    name: item.tradeName,
                    category: item.category,
                    strength: item.strength,
                    quantity: quantity,
                    available: item.stock
                }
            ]);
        }
        
        document.getElementById('request-item-modal').checked = false;
        toast.success(`Added ${item.tradeName} to order`);
    };

    // Remove item from order
    const removeFromOrder = (itemId) => {
        setSelectedItems(selectedItems.filter(item => item.itemId !== itemId));
    };

    // Submit the complete order
    const submitOrder = async () => {
        try {
            if (selectedItems.length === 0) {
                toast.error("Please add items to your order");
                return;
            }

            const orderData = {
                items: selectedItems,
                requestedBy: user._id,
                storeName: user.store_name,
                status: 'pending',
                note: orderNote,
                requestedAt: new Date()
            };

            const response = await axios.post(
                `${API_URL}/api/orders/pharmacy`,
                orderData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                toast.success('Order submitted successfully');
                setSelectedItems([]);
                setOrderNote('');
                setIsCreatingOrder(false);
            }
        } catch (error) {
            console.error('Order submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit order');
        }
    };

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Pharmacy Products'
                value={totalItems}
                buttons={[
                    <button 
                        key="cart-button"
                        className="btn btn-xs flex gap-x-2 bg-blue-500 hover:bg-blue-600 text-white" 
                        onClick={() => setIsCreatingOrder(true)}
                    >
                        <FiShoppingCart className='text-md' />
                        <span className="badge badge-accent text-xs font-bold">{selectedItems.length}</span>
                    </button>,
                    <SearchButton key="search-button" onClick={handleSearchToggle} />,
                    <RefreshButton key="refresh-button" onClick={() => fetchItems(currentPage)} />,
                    <PrintButton key="print-button" />
                ]}
            />

            {/* Search Modal */}
            {isSearching && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
                        <h3 className="text-lg font-bold mb-4 text-black">Search Products</h3>
                        <form onSubmit={handleSearch}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Enter product name, category, or company..."
                                    className="input input-bordered w-full focus:ring-2 focus:ring-primary text-black"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="submit" className="btn btn-primary">Search</button>
                                <button 
                                    type="button" 
                                    className="btn btn-outline"
                                    onClick={handleSearchToggle}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div className="overflow-x-auto mt-4 bg-white rounded-lg shadow-md">
                {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="loading loading-spinner loading-lg text-primary"></div>
                    </div>
                ) : (
                    <>
                        <table className="table table-zebra table-compact w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    {tableHeadItems.map((item, index) => (
                                        <th key={index} className='text-xs md:text-sm font-bold text-black'>{item}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-black">
                                {pharmacyItems.length > 0 ? (
                                    pharmacyItems.map((product, index) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td>
                                                <div>
                                                    <div className="font-bold text-black">{product.tradeName}</div>
                                                    <div className="text-xs text-gray-700">{product.genericName}</div>
                                                </div>
                                            </td>
                                            <td className="text-sm">{product.category}</td>
                                            <td className="text-sm">{product.strength}</td>
                                            <td className="text-sm">{product.company}</td>
                                            <td>
                                                <span className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-error'} text-xs font-semibold`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn btn-xs ${product.stock > 0 ? 'btn-primary' : 'btn-disabled'} flex items-center gap-1`}
                                                    onClick={() => handleRequestItem(product)}
                                                    disabled={product.stock <= 0}
                                                >
                                                    <FiPlus size={14} />
                                                    Add
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={tableHeadItems.length} className="text-center py-8 text-black">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <p className="text-lg font-medium">No products found</p>
                                                <p className="text-sm">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center my-4 px-4">
                                <div className="btn-group shadow-sm">
                                    <button 
                                        className="btn btn-sm bg-white hover:bg-gray-100 text-black border-gray-300" 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        «
                                    </button>
                                    
                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        // Show current page, first, last, and pages around current
                                        if (
                                            page === 1 || 
                                            page === totalPages || 
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button 
                                                    key={page}
                                                    className={`btn btn-sm ${currentPage === page 
                                                        ? 'bg-primary text-white hover:bg-primary-focus' 
                                                        : 'bg-white hover:bg-gray-100 text-black border-gray-300'}`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === currentPage - 2 || 
                                            page === currentPage + 2
                                        ) {
                                            return <button key={page} className="btn btn-sm bg-white text-black border-gray-300 hover:bg-gray-100">...</button>;
                                        }
                                        return null;
                                    })}
                                    
                                    <button 
                                        className="btn btn-sm bg-white hover:bg-gray-100 text-black border-gray-300" 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        »
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Request Item Modal */}
            <input type="checkbox" id="request-item-modal" className="modal-toggle" />
            <label htmlFor="request-item-modal" className="modal cursor-pointer">
                <label className="modal-box relative max-w-md">
                    <ModalCloseButton modalId={'request-item-modal'} />
                    <ModalHeading modalHeading={'Add to Order'} />
                    {requestingItem && (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            addToOrder(requestingItem, requestQuantity);
                        }} className='space-y-4'>
                            <div className='p-4 bg-gray-50 rounded-lg mb-4'>
                                <div className="text-xl font-bold text-black mb-2">{requestingItem.tradeName}</div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-700">Generic Name:</span>
                                        <p className="font-medium text-black">{requestingItem.genericName}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-700">Category:</span>
                                        <p className="font-medium text-black">{requestingItem.category}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-700">Strength:</span>
                                        <p className="font-medium text-black">{requestingItem.strength}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-700">Available Stock:</span>
                                        <p className={`font-medium ${requestingItem.stock > 10 ? 'text-green-600' : requestingItem.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                                            {requestingItem.stock}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-black">Quantity</span>
                                </label>
                                <div className="flex items-center justify-center">
                                    <button 
                                        type="button"
                                        className="btn btn-circle btn-sm bg-gray-100 hover:bg-gray-200 border-gray-300 text-black"
                                        onClick={() => setRequestQuantity(q => Math.max(1, q - 1))}
                                    >
                                        <FiMinus />
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={requestingItem.stock}
                                        value={requestQuantity}
                                        onChange={(e) => setRequestQuantity(Number(e.target.value))}
                                        className="input input-bordered w-20 mx-3 text-center font-bold text-black"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        className="btn btn-circle btn-sm bg-gray-100 hover:bg-gray-200 border-gray-300 text-black"
                                        onClick={() => setRequestQuantity(q => Math.min(requestingItem.stock, q + 1))}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Add to Order
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => {
                                        document.getElementById('request-item-modal').checked = false;
                                        setRequestingItem(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </label>
            </label>

            {/* Order Creation Modal */}
            {isCreatingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b">
                            <h3 className="text-xl font-bold text-black flex items-center">
                                <FiShoppingCart className="mr-2" /> Your Order
                            </h3>
                            <button 
                                className="btn btn-sm btn-circle bg-gray-100 hover:bg-gray-200 border-gray-300 text-black" 
                                onClick={() => setIsCreatingOrder(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        {selectedItems.length > 0 ? (
                            <>
                                <div className="overflow-x-auto mb-6 rounded-lg border">
                                    <table className="table table-compact w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-black">Product</th>
                                                <th className="text-black">Category</th>
                                                <th className="text-black">Strength</th>
                                                <th className="text-black">Quantity</th>
                                                <th className="text-black">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-black">
                                            {selectedItems.map((item) => (
                                                <tr key={item.itemId} className="hover:bg-gray-50">
                                                    <td className="font-medium">{item.name}</td>
                                                    <td>{item.category}</td>
                                                    <td>{item.strength}</td>
                                                    <td>
                                                        <div className="flex items-center">
                                                            <button 
                                                                type="button"
                                                                className="btn btn-xs btn-circle bg-gray-100 hover:bg-gray-200 border-gray-300 text-black"
                                                                onClick={() => {
                                                                    const newItems = selectedItems.map(i => 
                                                                        i.itemId === item.itemId 
                                                                            ? {...i, quantity: Math.max(1, i.quantity - 1)} 
                                                                            : i
                                                                    );
                                                                    setSelectedItems(newItems);
                                                                }}
                                                            >
                                                                <FiMinus size={12} />
                                                            </button>
                                                            <input 
                                                                type="number" 
                                                                min="1" 
                                                                max={item.available}
                                                                value={item.quantity} 
                                                                onChange={(e) => {
                                                                    const newItems = selectedItems.map(i => 
                                                                        i.itemId === item.itemId 
                                                                            ? {...i, quantity: Number(e.target.value)} 
                                                                            : i
                                                                    );
                                                                    setSelectedItems(newItems);
                                                                }}
                                                                className="input input-bordered input-xs w-16 mx-1 text-center text-black" 
                                                            />
                                                            <button 
                                                                type="button"
                                                                className="btn btn-xs btn-circle bg-gray-100 hover:bg-gray-200 border-gray-300 text-black"
                                                                onClick={() => {
                                                                    const newItems = selectedItems.map(i => 
                                                                        i.itemId === item.itemId 
                                                                            ? {...i, quantity: Math.min(i.available, i.quantity + 1)} 
                                                                            : i
                                                                    );
                                                                    setSelectedItems(newItems);
                                                                }}
                                                            >
                                                                <FiPlus size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-error btn-xs btn-circle"
                                                            onClick={() => removeFromOrder(item.itemId)}
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="form-control mb-6">
                                    <label className="label">
                                        <span className="label-text font-medium text-black">Order Notes</span>
                                    </label>
                                    <textarea 
                                        className="textarea textarea-bordered h-24 focus:ring-2 focus:ring-primary text-black"
                                        placeholder="Add any notes about this order..."
                                        value={orderNote}
                                        onChange={(e) => setOrderNote(e.target.value)}
                                    ></textarea>
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <button 
                                        className="btn btn-outline"
                                        onClick={() => setIsCreatingOrder(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={submitOrder}
                                    >
                                        Submit Order
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <FiShoppingCart size={24} className="text-gray-500" />
                                </div>
                                <p className="text-xl font-medium text-black mb-2">Your order is empty</p>
                                <p className="text-gray-700 mb-6">Add items to your order from the product list</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => setIsCreatingOrder(false)}
                                >
                                    Browse Products
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default PharmacyItems;