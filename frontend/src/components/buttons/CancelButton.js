import React from 'react';
import { FcCancel } from 'react-icons/fc';

const CancelButton = ({ extraClass, onClick }) => {
    return (
        <button type="button" className={`btn btn-xs flex gap-x-2 ${extraClass}`} onClick={onClick}>
            <FcCancel className='text-lg' />
            Cancel
        </button>
    );
};

export default CancelButton;