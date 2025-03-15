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

const API_BASE_URL = 'http://localhost:5000/api/products/pharmacy'; // Update this to match your backend

const NonPharmacyProducts = () => {
    const [pharmacyProducts, setPharmacyProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0); // Total product count
    const [totalPages, setTotalPages] = useState(0); // Total number of pages

    // Fetch paginated products
    const fetchProducts = async (page = 1, limit = productsPerPage) => {
        try {
            const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
            const data = await response.json();
            if (response.ok) {
                setPharmacyProducts(data.data);
                setTotalProducts(data.totalItems);
                setTotalPages(data.totalPages);
            } else {
                console.error('Error fetching products:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Fetch categories, companies, and unit types
    useEffect(() => {
        fetch(`${API_BASE_URL}/categories`)
            .then(res => res.json())
            .then(setCategories)
            .catch(error => console.error('Error fetching categories:', error));

        fetch(`${API_BASE_URL}/companies`)
            .then(res => res.json())
            .then(setCompanies)
            .catch(error => console.error('Error fetching companies:', error));

        fetch(`${API_BASE_URL}/unitTypes`)
            .then(res => res.json())
            .then(setUnitTypes)
            .catch(error => console.error('Error fetching unit types:', error));
    }, []);

    // Fetch products when the page changes
    useEffect(() => {
        fetchProducts(currentPage, productsPerPage);
    }, [currentPage]);

    const addNonPharmacyProduct = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const productDetails = Object.fromEntries(formData.entries());
        productDetails.addedBy = 'admin';
        productDetails.addedToDbAt = new Date().toISOString();

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productDetails)
            });
            const data = await response.json();
            if (response.ok) {
                setPharmacyProducts(prev => [...prev, data]);
                toast(<AddModal name={productDetails.tradeName} />);
                fetchProducts(currentPage, productsPerPage); // Refresh the product list
            } else {
                console.error('Error adding product:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        event.target.reset();
    };

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Pharmacy Products'
                value={totalProducts} // Display total product count
                buttons={[
                    <NewButton key="new-button" modalId='create-new-product' />,
                    <RefreshButton key="refresh-button" onClick={() => fetchProducts(currentPage, productsPerPage)} />,
                    <PrintButton key="print-button" />
                ]}
            />

            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-product'} />
                    <ModalHeading modalHeading={'Create a Pharmacy Product'} />
                    <form onSubmit={addNonPharmacyProduct}>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2'>
                            <Input title={'Trade Name'} type='text' name='tradeName' required />
                            <Input title={'Generic Name'} type='text' name='genericName' required />
                            <Input title={'Strength'} type='number' name='strength' required />
                            <Select title={'Category'} name='category' required options={categories.map(c => c.name)} />
                            <Select title={'Company'} name='company' required options={companies.map(c => c.name)} />
                        </div>
                        <SaveButton extraClass={'mt-4'} />
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
                    {pharmacyProducts.map((product, index) => (
                        <TableRow
                            key={product._id}
                            tableRowsData={[
                                (currentPage - 1) * productsPerPage + index + 1, // Calculate SN based on pagination
                                product.tradeName,
                                product.category,
                                product.strength,
                                product.company,
                                product.stock,
                                <span className='flex items-center gap-x-1'>
                                    <EditButton id={product._id} />
                                    <DeleteButton
                                        deleteApiLink={`${API_BASE_URL}/${product._id}`}
                                        itemId={product._id}
                                        name={product.tradeName}
                                        onDelete={() => fetchProducts(currentPage, productsPerPage)} // Refresh after deletion
                                    />
                                </span>
                            ]}
                        />
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
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
        </section>
    );
};

export default NonPharmacyProducts;