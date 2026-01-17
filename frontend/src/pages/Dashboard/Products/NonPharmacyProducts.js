import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SaveButton from '../../../components/buttons/SaveButton';
import CancelButton from '../../../components/buttons/CancelButton';
import PrintButton from '../../../components/buttons/PrintButton';
import NewButton from '../../../components/buttons/NewButton';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import DoubleInput from '../../../components/form/DoubleInput';
import ModalCloseButton from '../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../components/headings/ModalHeading';
import RefreshButton from '../../../components/buttons/RefreshButton';
import TableRow from '../../../components/TableRow';
import EditButton from '../../../components/buttons/EditButton';
import DeleteButton from '../../../components/buttons/DeleteButton';
import { toast } from 'react-toastify';
import DashboardPageHeading from '../../../components/headings/DashboardPageHeading';
import AddModal from '../../../components/modals/AddModal';
import SearchButton from '../../../components/buttons/SearchButton';
import ProductNewButton from '../../../components/buttons/ProductNewButton';
import ProductEditButton from '../../../components/buttons/ProductEditButton';
import ProductCancelButton from '../../../components/buttons/ProductCancelButton';
import { openModal, closeModal, useDashboardContext } from '../Dashboard';

const API_BASE_URL = 'http://localhost:5000/api/products/nonPharmacy';

const NonPharmacyProducts = () => {
    const [nonPharmacyProducts, setNonPharmacyProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Get dashboard context if available
    const dashboardContext = useDashboardContext();

    const handleOpenModal = () => {
        if (categories.length === 0 || companies.length === 0 || unitTypes.length === 0) {
            fetchDropdownData();
            toast.info("Loading form data...");
        }
        document.getElementById('create-new-product').checked = true;
    };

    const handleRefresh = () => {
        fetchProducts(currentPage, productsPerPage);
    };

    const fetchDropdownData = async () => {
        try {
            const [categoriesRes, companiesRes, unitTypesRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/setup/categories`),
                axios.get(`http://localhost:5000/api/setup/companies`),
                axios.get(`http://localhost:5000/api/setup/unitTypes`)
            ]);
    
            // Categories
            const categoriesData = categoriesRes.data;
            if (Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            } else if (categoriesData.data && Array.isArray(categoriesData.data)) {
                setCategories(categoriesData.data);
            } else {
                toast.error("Invalid categories data format");
            }
    
            // Companies
            const companiesData = companiesRes.data;
            if (Array.isArray(companiesData)) {
                setCompanies(companiesData);
            } else if (companiesData.data && Array.isArray(companiesData.data)) {
                setCompanies(companiesData.data);
            } else {
                toast.error("Invalid companies data format");
            }
    
            // Unit Types
            const unitTypesData = unitTypesRes.data;
            if (Array.isArray(unitTypesData)) {
                setUnitTypes(unitTypesData);
            } else if (unitTypesData.data && Array.isArray(unitTypesData.data)) {
                setUnitTypes(unitTypesData.data);
            } else {
                toast.error("Invalid unit types data format");
            }
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
            toast.error('Failed to load form data');
        }
    };

    const fetchProducts = async (page = 1, limit = productsPerPage) => {
        try {
            // Get user information from context or localStorage
            const user = dashboardContext?.userInfo || JSON.parse(localStorage.getItem('user'));
            const storeId = user?.store_id;
            const userRole = user?.role;
            
            // Build URL with query parameters
            let url = `${API_BASE_URL}?page=${page}&limit=${limit}`;
            
            // Only filter by store if not a superadmin
            if (userRole !== 'superadmin' && storeId) {
                url += `&store=${storeId}`;
                console.log('Filtering products by store:', storeId);
            }
            
            const response = await axios.get(url);
            const data = response.data;
            
            // Check if we got data
            if (data && Array.isArray(data.data)) {
                setNonPharmacyProducts(data.data);
                setTotalProducts(data.totalItems);
                setTotalPages(data.totalPages);
                
                if (data.data.length === 0 && userRole !== 'superadmin') {
                    toast.info(`No products found for your store. Contact an administrator if you need access to more products.`);
                }
            } else {
                console.error('Invalid data format received:', data);
                toast.error('Invalid data format received from the server');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch products');
        }
    };

    const handleOpenEditModal = async (productId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${productId}`);
            const productData = response.data;
            const productToEdit = productData.data || productData;
            
            setCurrentProduct(productToEdit);
            
            if (categories.length === 0 || companies.length === 0 || unitTypes.length === 0) {
                fetchDropdownData();
            }
            
            document.getElementById('edit-product').checked = true;
        } catch (error) {
            console.error('Error fetching product for edit:', error);
            toast.error(`Could not load product: ${error.message}`);
        }
    };

    const addNonPharmacyProduct = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const productDetails = Object.fromEntries(formData.entries());
    
        const requiredFields = ['tradeName', 'category', 'company', 'unitType'];
        const missingFields = requiredFields.filter(field => !productDetails[field]);
    
        if (missingFields.length > 0) {
            toast.error(`Missing required fields: ${missingFields.join(', ')}`);
            return;
        }
    
        productDetails.addedBy = 'admin';
        productDetails.addedToDbAt = new Date().toISOString();
    
        try {
            const response = await axios.post(
                API_BASE_URL, 
                productDetails, 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
    
            document.getElementById('create-new-product').checked = false;
            toast.success('Product added successfully');
            fetchProducts(currentPage, productsPerPage);
            event.target.reset();
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error(error.response?.data?.message || 'Failed to add product');
        }
    };

    const updateNonPharmacyProduct = async (event) => {
        event.preventDefault();
        
        if (!currentProduct) {
            toast.error('No product selected for update');
            return;
        }
        
        const formData = new FormData(event.target);
        const productDetails = Object.fromEntries(formData.entries());
        
        ['stock', 'price'].forEach(field => {
            if (productDetails[field]) {
                productDetails[field] = Number(productDetails[field]);
            }
        });
        
        productDetails.updatedBy = 'admin';
        productDetails.updatedAt = new Date().toISOString();
        
        try {
            const response = await axios.put(
                `${API_BASE_URL}/${currentProduct._id}`,
                productDetails,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
    
            toast.success('Product updated successfully');
            document.getElementById('edit-product').checked = false;
            fetchProducts(currentPage, productsPerPage);
            setCurrentProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    };

    const handleSearchToggle = () => {
        setIsSearching(!isSearching);
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            // Get user information from context or localStorage
            const user = dashboardContext?.userInfo || JSON.parse(localStorage.getItem('user'));
            const storeId = user?.store_id;
            const userRole = user?.role;
            
            // Build URL with query parameters
            let url = `${API_BASE_URL}?search=${searchTerm}&page=1&limit=${productsPerPage}`;
            
            // Only filter by store if not a superadmin
            if (userRole !== 'superadmin' && storeId) {
                url += `&store=${storeId}`;
            }
            
            const response = await axios.get(url);
            const data = response.data;
            
            setNonPharmacyProducts(data.data);
            setTotalProducts(data.totalItems);
            setTotalPages(data.totalPages);
            setCurrentPage(1);
            setIsSearching(false);
            
            toast.success(`Found ${data.totalItems} products matching "${searchTerm}"`);
        } catch (error) {
            console.error('Error searching products:', error);
            toast.error(error.response?.data?.message || 'Failed to search products');
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, productsPerPage);
    }, [currentPage, productsPerPage]);

    useEffect(() => {
        fetchDropdownData();
    }, []);

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Non-Pharmacy Products'
                value={totalProducts}
                buttons={[
                    <ProductNewButton 
                        key="new-button" 
                        modalId='create-new-product' 
                        fetchDropdownData={fetchDropdownData}
                        dashboardContext={dashboardContext}
                        openModal={openModal}
                        btnSize="btn-sm"
                        title="New Product"
                    />,
                    <SearchButton key="search-button" onClick={handleSearchToggle} />,
                    <RefreshButton key="refresh-button" onClick={handleRefresh} />,
                    <PrintButton key="print-button" />
                ]}
            />
            
            {/* Search overlay/modal */}
            {isSearching && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Search Products</h3>
                        <form onSubmit={handleSearch}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Enter product name, category, or company..."
                                    className="input input-bordered w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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

            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-product'} />
                    <ModalHeading modalHeading={'Create a Non-Pharmacy Product'} />
                    <form onSubmit={addNonPharmacyProduct}>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2'>
                            <Input title={'Trade Name'} type='text' name='tradeName' required />
                            <Select title={'Category'} name='category' isRequired='required' options={categories.map(c => c.Name)} />
                            <Select title={'Company'} name='company' isRequired='required' options={companies.map(c => c.Name)} />
                            <Select title={'Unit Type'} name='unitType' isRequired='required' options={unitTypes.map(u => u.Name)} />
                            <Input title={'Stock'} type='number' name='stock' defaultValue={0} />
                            <Input title={'Price'} type='number' name='price' defaultValue={0} />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <SaveButton extraClass={''} />
                            <ProductCancelButton 
                                modalId='create-new-product'
                                dashboardContext={dashboardContext}
                                closeModal={closeModal}
                                resetForm={() => document.getElementById('create-product-form')?.reset()}
                            />
                        </div>
                    </form>
                </label>
            </label>

            <input type="checkbox" id="edit-product" className="modal-toggle" />
            <label htmlFor="edit-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'edit-product'} />
                    <ModalHeading modalHeading={'Edit Non-Pharmacy Product'} />
                    {currentProduct && (
                        <form onSubmit={updateNonPharmacyProduct}>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2'>
                                <Input 
                                    title={'Product Name'} 
                                    type='text' 
                                    name='tradeName' 
                                    defaultValue={currentProduct.tradeName} 
                                    value={currentProduct.tradeName}
                                    onChange={(e) => setCurrentProduct({...currentProduct, tradeName: e.target.value})}
                                    required 
                                />
                                <Select 
                                    title={'Category'} 
                                    name='category' 
                                    isRequired='required' 
                                    options={categories.map(c => c.Name)} 
                                    defaultValue={currentProduct.category}
                                    value={currentProduct.category}
                                    onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                                />
                                <Input 
                                    title={'Strength'} 
                                    type='text' 
                                    name='strength' 
                                    defaultValue={currentProduct.strength || 'N/A'}
                                    value={currentProduct.strength || 'N/A'}
                                    onChange={(e) => setCurrentProduct({...currentProduct, strength: e.target.value})}
                                />
                                <Select 
                                    title={'Company'} 
                                    name='company' 
                                    isRequired='required' 
                                    options={companies.map(c => c.Name)} 
                                    defaultValue={currentProduct.company}
                                    value={currentProduct.company}
                                    onChange={(e) => setCurrentProduct({...currentProduct, company: e.target.value})}
                                />
                                <Input 
                                    title={'Stock'} 
                                    type='number' 
                                    name='stock' 
                                    defaultValue={currentProduct.stock || 0}
                                    value={currentProduct.stock || 0}
                                    onChange={(e) => setCurrentProduct({...currentProduct, stock: e.target.value})}
                                    required
                                />
                                <Input 
                                    title={'Pack Type'} 
                                    type='text' 
                                    name='packType' 
                                    defaultValue={currentProduct.packType || 'Various'}
                                    value={currentProduct.packType || 'Various'}
                                    onChange={(e) => setCurrentProduct({...currentProduct, packType: e.target.value})}
                                />
                                <Input 
                                    title={'Pack MRP'} 
                                    type='number' 
                                    name='price' 
                                    defaultValue={currentProduct.price || 0}
                                    value={currentProduct.price || 0}
                                    onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                                    required
                                />
                                <Input 
                                    title={'Code'} 
                                    type='text' 
                                    name='code' 
                                    defaultValue={currentProduct.code}
                                    value={currentProduct.code}
                                    disabled
                                />
                            </div>
                            <div className="flex gap-2 mt-4">
                                <SaveButton extraClass={''} />
                                <ProductCancelButton 
                                    modalId="edit-product"
                                    setEditingProduct={setCurrentProduct}
                                    setIsEditing={setIsModalOpen}
                                    dashboardContext={dashboardContext}
                                    closeModal={closeModal}
                                />
                            </div>
                        </form>
                    )}
                </label>
            </label>

            <table className="table table-zebra table-compact">
                <thead>
                    <tr>
                        {['SN', 'Trade Name', 'Category', 'Company', 'Stock', 'Actions'].map((item, index) => (
                            <th key={index} className='text-xs md:text-2xs lg:text-md'>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {nonPharmacyProducts.length > 0 ? (
                        nonPharmacyProducts.map((product, index) => (
                            <TableRow
                                key={product._id}
                                tableRowsData={[
                                    (currentPage - 1) * productsPerPage + index + 1,
                                    product.tradeName,
                                    product.category,
                                    product.company,
                                    product.stock || 0,
                                    // In the TableRow component, update the EditButton implementation
                                    <span className='flex items-center gap-x-1'>
                                        <ProductEditButton 
                                            product={product}
                                            setEditingProduct={setCurrentProduct}
                                            setIsEditing={setIsModalOpen}
                                            dashboardContext={dashboardContext}
                                            openModal={openModal}
                                        />
                                        <DeleteButton
                                            deleteApiLink={`${API_BASE_URL}/${product._id}`}
                                            itemId={product._id}
                                            name={product.tradeName}
                                            onDelete={() => fetchProducts(currentPage, productsPerPage)}
                                        />
                                    </span>
                                ]}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className='pagination mt-4 flex justify-center gap-2'>
                    {/* Previous Button */}
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className='btn btn-sm'
                    >
                        Previous
                    </button>

                    {/* First Page Button */}
                    {currentPage > 1 && (
                        <button
                            onClick={() => setCurrentPage(1)}
                            className={`btn btn-sm ${currentPage === 1 ? 'btn-active' : ''}`}
                        >
                            1
                        </button>
                    )}

                    {/* Ellipsis for Skipped Pages */}
                    {currentPage > 2 && <span className='btn btn-sm btn-disabled'>...</span>}

                    {/* Middle Pages */}
                    {Array.from({ length: totalPages }, (_, i) => {
                        const pageNumber = i + 1;
                        // Show only a subset of pages around the current page
                        if (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2) {
                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`btn btn-sm ${currentPage === pageNumber ? 'btn-active' : ''}`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        }
                        return null;
                    })}

                    {/* Ellipsis for Skipped Pages */}
                    {currentPage < totalPages - 2 && <span className='btn btn-sm btn-disabled'>...</span>}

                    {/* Last Page Button */}
                    {currentPage < totalPages && (
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`btn btn-sm ${currentPage === totalPages ? 'btn-active' : ''}`}
                        >
                            {totalPages}
                        </button>
                    )}

                    {/* Next Button */}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className='btn btn-sm'
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
};

export default NonPharmacyProducts;