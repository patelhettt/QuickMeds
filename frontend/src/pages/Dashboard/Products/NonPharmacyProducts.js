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

const API_BASE_URL = 'http://localhost:5000/api/products/nonPharmacy';

const NonPharmacyProducts = () => {
    const [nonPharmacyProducts, setNonPharmacyProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const productsPerPage = 10;
    const maxVisiblePages = 5; // Only show 5 pages at a time

    // Fetch Non-Pharmacy Products
    const fetchProducts = async (page) => {
        try {
            const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${productsPerPage}`);
            const data = await response.json();
            if (response.ok) {
                setNonPharmacyProducts(data.data);
                setTotalProducts(data.totalItems || 0);
                setTotalPages(data.totalPages || 1);
            } else {
                console.error('Unexpected response format:', data);
                setNonPharmacyProducts([]);
            }
        } catch (error) {
            console.error('Error fetching non-pharmacy products:', error);
        }
    };

    // Fetch data when the page changes
    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    // Add New Product
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
                body: JSON.stringify(productDetails),
            });

            if (response.ok) {
                toast(<AddModal name={productDetails.tradeName} />);
                fetchProducts(currentPage); // Refresh the product list
            } else {
                console.error('Error adding product:', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
        event.target.reset();
    };

    // Pagination controls
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Render optimized pagination with ellipsis
    const renderPagination = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // "Previous" button
        pages.push(
            <button
                key="prev"
                className={`btn btn-sm ${currentPage === 1 ? 'btn-disabled' : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
        );

        // First page and ellipsis
        if (startPage > 1) {
            pages.push(
                <button key={1} className={`btn btn-sm ${currentPage === 1 ? 'btn-active' : ''}`} onClick={() => handlePageChange(1)}>
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="start-ellipsis" className="btn btn-sm btn-disabled">...</span>);
            }
        }

        // Middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button key={i} className={`btn btn-sm ${currentPage === i ? 'btn-active' : ''}`} onClick={() => handlePageChange(i)}>
                    {i}
                </button>
            );
        }

        // Last page and ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="end-ellipsis" className="btn btn-sm btn-disabled">...</span>);
            }
            pages.push(
                <button key={totalPages} className={`btn btn-sm ${currentPage === totalPages ? 'btn-active' : ''}`} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </button>
            );
        }

        // "Next" button
        pages.push(
            <button
                key="next"
                className={`btn btn-sm ${currentPage === totalPages ? 'btn-disabled' : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        );

        return pages;
    };

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name={`Non Pharmacy Products (${totalProducts})`}
                value={totalProducts}
                buttons={[
                    <NewButton key="new-button" modalId='create-new-product' />,
                    <RefreshButton key="refresh-button" onClick={() => fetchProducts(currentPage)} />,
                    <PrintButton key="print-button" />
                ]}
            />

            {/* Products Table */}
            <table className="table table-zebra table-compact">
                <thead>
                    <tr>
                        {['SN', 'Product Name', 'Category', 'Company', 'Stock', 'Pack Type', 'Pack TP', 'Pack MRP', 'Actions'].map((item, index) => (
                            <th key={index} className='text-xs md:text-2xs lg:text-md'>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {nonPharmacyProducts.map((product, index) => (
                        <TableRow
                            key={product._id}
                            tableRowsData={[
                                (currentPage - 1) * productsPerPage + index + 1,
                                product.Product_name || 'N/A',
                                product.Category || 'N/A',
                                product.Company || 'N/A',
                                product.Stock || 'N/A',
                                product.Pack_Type || 'N/A',
                                product.Pack_TP || 'N/A',
                                product.Pack_MRP || 'N/A',
                                <span className='flex items-center gap-x-1'>
                                    <EditButton id={product._id} />
                                    <DeleteButton deleteApiLink={`${API_BASE_URL}/${product._id}`} itemId={product._id} name={product.tradeName} />
                                </span>
                            ]}
                        />
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
                {renderPagination()}
            </div>
        </section>
    );
};

export default NonPharmacyProducts;
