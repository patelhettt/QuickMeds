import React from 'react';
import { MdOutlineAddBox } from 'react-icons/md';

const NewButton = ({ 
    modalId, 
    btnSize = 'btn-xs', 
    title = "New", 
    icon = <MdOutlineAddBox className='text-lg' /> 
}) => {
    return (
        <label htmlFor={`${modalId}`} className={`btn ${btnSize} gap-x-2 modal-button`}>
            {icon}
            {title}
        </label>
    );
};

export default NewButton;