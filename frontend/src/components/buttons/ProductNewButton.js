import React from 'react';
import { MdOutlineAddBox } from 'react-icons/md';
import { toast } from 'react-toastify';

/**
 * Specialized NewButton component for product operations
 * Handles context, dropdown data loading, and modal opening
 */
const ProductNewButton = ({ 
    modalId = 'create-new-product',
    btnSize = 'btn-sm', 
    title = "New Product", 
    icon = <MdOutlineAddBox className='text-lg' />,
    fetchDropdownData,
    dashboardContext,
    openModal
}) => {
    // Handle click with context awareness and data preloading
    const handleClick = (e) => {
        e.preventDefault();
        
        // Load form data if needed
        if (fetchDropdownData) {
            fetchDropdownData();
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
            className={`btn ${btnSize} gap-x-2`} 
            onClick={handleClick}
            data-modal-id={modalId}
        >
            {icon}
            {title}
        </button>
    );
};

export default ProductNewButton; 