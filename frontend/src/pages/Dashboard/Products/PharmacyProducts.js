import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/products/pharmacy';

const NonPharmacyProducts = () => {
    const [pharmacyProducts, setPharmacyProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);


    // Add these state variables at the top with other state declarations
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Add this function before the return statement
    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsEditing(true);
        document.getElementById('edit-product').checked = true;
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            const updatedData = {
                tradeName: formData.get('tradeName')?.trim(),
                genericName: formData.get('genericName')?.trim(),
                strength: formData.get('strength'),
                category: formData.get('category'),
                company: formData.get('company'),
                unitType: formData.get('unitType')
            };
    
            if (!updatedData.tradeName || !updatedData.genericName || !updatedData.strength ||
                !updatedData.category || !updatedData.company || !updatedData.unitType) {
                toast.error("All fields are required");
                return;
            }
    
            const response = await axios.put(
                `${API_BASE_URL}/${editingProduct._id}`, 
                updatedData, 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
    
            toast.success("Product updated successfully");
            fetchProducts(currentPage, productsPerPage);
            document.getElementById('edit-product').checked = false;
            setEditingProduct(null);
            setIsEditing(false);
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Failed to update product");
        }
    };



    // Function to handle opening the modal
    const handleOpenModal = () => {
        // Check if dropdown data is loaded
        if (categories.length === 0 || companies.length === 0 || unitTypes.length === 0) {
            // If data isn't loaded yet, fetch it first
            fetchDropdownData();
            toast.info("Loading form data...");
        }
        document.getElementById('create-new-product').checked = true;
    };

    // Function to handle refresh
    const handleRefresh = () => {
        fetchProducts(currentPage, productsPerPage);
    };

    // Separate function to fetch dropdown data
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
    

    // Fetch paginated products
    const fetchProducts = async (page = 1, limit = productsPerPage) => {
        try {
            const response = await axios.get(`${API_BASE_URL}?page=${page}&limit=${limit}`);
            const data = response.data;
            setPharmacyProducts(data.data);
            setTotalProducts(data.totalItems);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch products');
        }
    };
    

    // Fetch products when the page changes
    useEffect(() => {
        fetchProducts(currentPage, productsPerPage);
    }, [currentPage, productsPerPage]);

    // Fetch dropdown data when component mounts
    useEffect(() => {
        fetchDropdownData();
    }, []);

    const addPharmacyProduct = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const productDetails = Object.fromEntries(formData.entries());
    
        // Check for required fields
        const requiredFields = ['tradeName', 'genericName', 'strength', 'category', 'company', 'unitType'];
        const missingFields = requiredFields.filter(field => !productDetails[field]);
    
        if (missingFields.length > 0) {
            toast.error(`Missing required fields: ${missingFields.join(', ')}`);
            return;
        }
    
        // Add metadata
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
    
            // Close the modal
            document.getElementById('create-new-product').checked = false;
    
            // Show success message
            toast.success(<AddModal name={productDetails.tradeName} />);
    
            // Refresh the product list
            fetchProducts(currentPage, productsPerPage);
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error(error.response?.data?.message || 'Failed to add product');
        }
    
        // Reset the form
        event.target.reset();
    };

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Pharmacy Products'
                value={totalProducts}
                buttons={[
                    <NewButton key="new-button" modalId='create-new-product' onClick={handleOpenModal} />,
                    <RefreshButton key="refresh-button" onClick={handleRefresh} />,
                    <PrintButton key="print-button" />
                ]}
            />

            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-product'} />
                    <ModalHeading modalHeading={'Create a Pharmacy Product'} />
                    <form onSubmit={addPharmacyProduct}>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2'>
                            <Input title={'Trade Name'} type='text' name='tradeName' required />
                            <Input title={'Generic Name'} type='text' name='genericName' required />
                            <Input title={'Strength'} type='number' name='strength' required />
                            <Select title={'Category'} name='category' isRequired='required' options={categories.map(c => c.Name)} />
                            <Select title={'Company'} name='company' isRequired='required' options={companies.map(c => c.Name)} />
                            <Select title={'Unit Type'} name='unitType' isRequired='required' options={unitTypes.map(u => u.Name)} />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <SaveButton extraClass={''} />
                            <CancelButton modalId={'create-new-product'} />
                        </div>
                    </form>
                </label>
            </label>

            <table className="table table-zebra table-compact">
                <thead>
                    <tr>
                        {['SN', 'Trade Name', 'Category', 'Strength', 'Company', 'Stock', 'Actions'].map((item, index) => (
                            <th key={index} className='text-xs md:text-2xs lg:text-md'>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {pharmacyProducts.length > 0 ? (
                        pharmacyProducts.map((product, index) => (
                            <TableRow
                                key={product._id}
                                tableRowsData={[
                                    (currentPage - 1) * productsPerPage + index + 1,
                                    product.tradeName,
                                    product.category,
                                    product.strength,
                                    product.company,
                                    product.stock,
                                    // In the TableRow component, replace the custom button with EditButton
                                    <span className='flex items-center gap-x-1'>
                                        <EditButton onClick={() => handleEdit(product)} />
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
                            <td colSpan="7" className="text-center py-4">No products found</td>
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

            <input type="checkbox" id="edit-product" className="modal-toggle" />
            <label htmlFor="edit-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative">
                    <ModalCloseButton modalId={'edit-product'} />
                    <ModalHeading modalHeading={'Update Product'} />
                    {editingProduct && (
                        <form onSubmit={handleUpdate}>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2'>
                                <Input
                                    title={'Trade Name'}
                                    type='text'
                                    name='tradeName'
                                    required
                                    defaultValue={editingProduct.tradeName}
                                />
                                <Input
                                    title={'Generic Name'}
                                    type='text'
                                    name='genericName'
                                    required
                                    defaultValue={editingProduct.genericName}
                                />
                                <Input
                                    title={'Strength'}
                                    type='number'
                                    name='strength'
                                    required
                                    defaultValue={editingProduct.strength}
                                />
                                <Select
                                    title={'Category'}
                                    name='category'
                                    isRequired='required'
                                    options={categories.map(c => c.Name)}
                                    defaultValue={editingProduct.category}
                                />
                                <Select
                                    title={'Company'}
                                    name='company'
                                    isRequired='required'
                                    options={companies.map(c => c.Name)}
                                    defaultValue={editingProduct.company}
                                />
                                <Select
                                    title={'Unit Type'}
                                    name='unitType'
                                    isRequired='required'
                                    options={unitTypes.map(u => u.Name)}
                                    defaultValue={editingProduct.unitType}
                                />
                            </div>
                            <div className="flex gap-2 mt-4">
                                <SaveButton />
                                <CancelButton onClick={() => {
                                    document.getElementById('edit-product').checked = false;
                                    setEditingProduct(null);
                                    setIsEditing(false);
                                }} />
                            </div>
                        </form>
                    )}
                </label>
            </label>
        </section>
    );
};

export default NonPharmacyProducts;

{/* Add this edit modal before the closing section tag */ }
