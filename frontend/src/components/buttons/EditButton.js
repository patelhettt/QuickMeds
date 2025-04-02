import React from 'react';
import { FaEdit } from 'react-icons/fa';

const EditButton = ({ 
    onClick, 
    btnSize = 'btn-xs', 
    title = "", 
    icon = <FaEdit className='text-lg' />, 
}) => {
    return (
        <button 
            className={`btn ${btnSize} gap-x-2 text-info`} 
            onClick={onClick}
        >
            {icon}
            {title}
        </button>
    );
};

export default EditButton;