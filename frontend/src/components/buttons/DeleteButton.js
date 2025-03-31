import React from 'react';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import DeleteModal from '../modals/DeleteModal';

const DeleteButton = ({ deleteApiLink, itemId, name, onDelete }) => {
    const deleteItem = () => {
        const token = localStorage.getItem('token'); // Retrieve the token
    
        if (!token) {
            toast.error("Unauthorized: No token found.");
            return;
        }
    
        fetch(deleteApiLink, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Send token for authentication
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.message && data.message.includes('deleted successfully')) {
                toast(<DeleteModal name={name} />);
                if (onDelete && typeof onDelete === 'function') {
                    onDelete();
                }
            } else if (data.deletedCount > 0) {
                toast(<DeleteModal name={name} />);
                if (onDelete && typeof onDelete === 'function') {
                    onDelete();
                }
            } else {
                toast.error(`Failed to delete ${name}`);
            }
        })
        .catch(error => {
            console.error('Delete error:', error);
            toast.error(`Error deleting ${name}: ${error.message}`);
        });
    };
    
    return (
        <button onClick={deleteItem}
            className="z-10 block p-1 text-red-700 transition-all bg-red-100 border-2 border-white rounded-full active:bg-red-50 hover:scale-110 focus:outline-none focus:ring"
            type="button"
        >
            <RiDeleteBin6Fill />
        </button>
    );
};

export default DeleteButton;