import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDashboardContext } from '../Dashboard';
import DashboardPageHeading from '../../../components/headings/DashboardPageHeading';
import ProductNewButton from '../../../components/buttons/ProductNewButton';
import SearchButton from '../../../components/buttons/SearchButton';
import RefreshButton from '../../../components/buttons/RefreshButton';
import PrintButton from '../../../components/buttons/PrintButton';
import PharmacyProductForm from '../../../components/forms/PharmacyProductForm';
import PharmacyProductList from '../../../components/tables/PharmacyProductList';

const API_BASE_URL = 'http://localhost:5000/api/products/pharmacy';

const PharmacyProducts = () => {
    const [pharmacyProducts, setPharmacyProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const dashboardContext = useDashboardContext();

    // Fetch dropdown data
    const fetchDropdownData = async () => {
        try {
            const [categoriesRes, companiesRes, unitTypesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/setup/categories'),
                axios.get('http://localhost:5000/api/setup/companies'),
                axios.get('http://localhost:5000/api/setup/unitTypes')
            ]);
            
            setCategories(categoriesRes.data);
            setCompanies(companiesRes.data);
            setUnitTypes(unitTypesRes.data);
        } catch (error) {
            toast.error('Failed to load form data');
        }
    };
    
    // Fetch products
    const fetchProducts = async (page = currentPage) => {
        try {
            const response = await axios.get(`${API_BASE_URL}?page=${page}&limit=${productsPerPage}`);
            setPharmacyProducts(response.data.data);
            setTotalProducts(response.data.totalItems);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error('Failed to fetch products');
        }
    };
    
    useEffect(() => {
        fetchProducts();
        fetchDropdownData();
    }, [currentPage]);

    // Handle form submission for new/edit product
    const handleSubmit = async (formData) => {
        try {
            if (editingProduct) {
                await axios.put(`${API_BASE_URL}/${editingProduct._id}`, formData);
                toast.success('Product updated successfully');
            } else {
                await axios.post(API_BASE_URL, formData);
                toast.success('Product added successfully');
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    // Handle product deletion
    const handleDelete = async (productId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${productId}`);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    // Handle search
    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`${API_BASE_URL}?search=${searchTerm}`);
            setPharmacyProducts(response.data.data);
            setTotalProducts(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setIsSearching(false);
        } catch (error) {
            toast.error('Search failed');
        }
    };

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Pharmacy Products'
                value={totalProducts}
                buttons={[
                    <button 
                        key="new"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                            setEditingProduct(null);
                            setIsModalOpen(true);
                        }}
                    >
                        New Product
                    </button>,
                    <SearchButton key="search" onClick={() => setIsSearching(true)} />,
                    <RefreshButton key="refresh" onClick={() => fetchProducts()} />,
                    <PrintButton key="print" />
                ]}
            />

            {/* Product List */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                <thead>
                    <tr>
                            <th className="hidden lg:table-cell">SN</th>
                            <th>Trade Name</th>
                            <th className="hidden md:table-cell">Category</th>
                            <th className="hidden sm:table-cell">Strength</th>
                            <th className="hidden lg:table-cell">Company</th>
                            <th>Stock</th>
                            <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                        {pharmacyProducts.map((product, index) => (
                            <tr key={product._id}>
                                <td className="hidden lg:table-cell">
                                    {(currentPage - 1) * productsPerPage + index + 1}
                                </td>
                                <td>{product.tradeName}</td>
                                <td className="hidden md:table-cell">{product.category}</td>
                                <td className="hidden sm:table-cell">{product.strength}</td>
                                <td className="hidden lg:table-cell">{product.company}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="btn btn-sm btn-square"
                                            onClick={() => {
                                                setEditingProduct(product);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className="btn btn-sm btn-square btn-error"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </td>
                        </tr>
                        ))}
                </tbody>
            </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                    <button
                        className="btn btn-sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
                        .map((page) => (
                        <button
                                key={page}
                                className={`btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                        >
                                {page}
                        </button>
                        ))}
                    <button
                        className="btn btn-sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => {
                            setIsModalOpen(false);
                            setEditingProduct(null);
                        }}></div>
                        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">
                                    {editingProduct ? 'Update Product' : 'Create New Product'}
                                </h3>
                                <button 
                                    className="btn btn-sm btn-circle"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingProduct(null);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            <PharmacyProductForm 
                                isEdit={!!editingProduct}
                                productData={editingProduct}
                                categories={categories}
                                companies={companies}
                                unitTypes={unitTypes}
                                onSubmit={handleSubmit}
                                onCancel={() => {
                                    setIsModalOpen(false);
                                    setEditingProduct(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Search Modal */}
            {isSearching && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSearching(false)}></div>
                        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Search Products</h3>
                                <button 
                                    className="btn btn-sm btn-circle"
                                    onClick={() => setIsSearching(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    className="input input-bordered w-full mb-4"
                                    placeholder="Search by name, category, or company..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="flex justify-end gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Search
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn"
                                        onClick={() => setIsSearching(false)}
                                    >
                                        Cancel
                                    </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
                    )}
        </section>
    );
};

export default PharmacyProducts;
