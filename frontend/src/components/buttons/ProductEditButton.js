import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

/**
 * Specialized EditButton component for product operations
 * Handles product state updates, context, and modal opening
 */
const ProductEditButton = ({ 
    modalId = 'edit-product',
    btnSize = 'btn-xs', 
    title = "", 
    icon = <FaEdit className='text-lg' />,
    product,
    setEditingProduct,
    setIsEditing,
    dashboardContext,
    openModal
}) => {
    // Handle click with product data and context awareness
    const handleClick = (e) => {
        e.preventDefault();
        
        // Update product state if handlers provided
        if (setEditingProduct && product) {
            setEditingProduct(product);
        }
        
        if (setIsEditing) {
            setIsEditing(true);
        }
        
        // Try using context methods first
        if (dashboardContext && dashboardContext.handleOpenModal) {
            dashboardContext.handleOpenModal(modalId);
            return;
        }
        
        // Then try imported helper
        if (typeof openModal === 'function') {
            openModal(modalId);
            return;
        }
        
        // Fallback to direct DOM
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.checked = true;
        } else {
            toast.error("Modal not found");
        }
    };
    
    return (
        <button 
            className={`btn ${btnSize} gap-x-2 text-info`} 
            onClick={handleClick}
            data-modal-id={modalId}
            data-product-id={product?._id}
        >
            {icon}
            {title}
        </button>
    );
};

export default ProductEditButton; 