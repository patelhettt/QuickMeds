import React from 'react';
import { FiRefreshCcw } from 'react-icons/fi';

const RefreshButton = ({ btnSize = 'btn-xs', onClick }) => {
    return (
        <button className={`btn ${btnSize} flex gap-x-2`} onClick={onClick}>
            <FiRefreshCcw className='text-md' />
            Refresh
        </button>
    );
};

export default RefreshButton;
