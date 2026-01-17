import React from 'react';
import TableRow from '../TableRow';
import ProductEditButton from '../buttons/ProductEditButton';
import DeleteButton from '../buttons/DeleteButton';

const PharmacyProductList = ({ 
    products = [], 
    currentPage, 
    productsPerPage,
    onEdit,
    onDelete,
    dashboardContext
}) => {
    return (
        <div className="overflow-x-auto w-full">
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
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <tr key={product._id} className="hover">
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
                                        <ProductEditButton
                                            product={product}
                                            onClick={() => onEdit(product)}
                                            dashboardContext={dashboardContext}
                                        />
                                        <DeleteButton
                                            onClick={() => onDelete(product._id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4">
                                No products found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PharmacyProductList; 