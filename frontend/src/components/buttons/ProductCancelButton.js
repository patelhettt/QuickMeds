import React from 'react';
import { FcCancel } from 'react-icons/fc';
import { toast } from 'react-toastify';

/**
 * Specialized CancelButton component for product operations
 * Handles modal closing, state resetting, and context
 */
const ProductCancelButton = ({ 
    modalId,
    btnSize = 'btn-xs',
    extraClass = '',
    title = "Cancel", 
    icon = <FcCancel className='text-lg' />,
    setIsEditing,
    setEditingProduct,
    dashboardContext,
    closeModal,
    resetForm
}) => {
    // Handle click with proper cleanup and context awareness
    const handleClick = (e) => {
        e.preventDefault();
        
        // Reset editing state if handlers provided
        if (setIsEditing) {
            setIsEditing(false);
        }
        
        if (setEditingProduct) {
            setEditingProduct(null);
        }
        
        // Call any additional reset handler if provided
        if (resetForm) {
            resetForm();
        }
        
        // Try using context methods first
        if (dashboardContext && dashboardContext.handleCloseModal && modalId) {
            dashboardContext.handleCloseModal(modalId);
            return;
        }
        
        // Then try imported helper
        if (typeof closeModal === 'function' && modalId) {
            closeModal(modalId);
            return;
        }
        
        // Fallback to direct DOM
        if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.checked = false;
            } else {
                toast.error("Modal not found");
            }
        }
    };
    
    return (
        <button 
            type="button"
            className={`btn ${btnSize} flex gap-x-2 ${extraClass}`} 
            onClick={handleClick}
            data-modal-id={modalId}
        >
            {icon}
            {title}
        </button>
    );
};

export default ProductCancelButton;