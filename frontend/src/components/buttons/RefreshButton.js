import React from 'react';
import { FiRefreshCcw } from 'react-icons/fi';

const RefreshButton = ({ btnSize = 'btn-xs', onClick, isLoading = false }) => {
    return (
        <button 
            className={`btn ${btnSize} flex gap-x-2 ${isLoading ? 'loading' : ''}`} 
            onClick={onClick}
            disabled={isLoading}
        >
            {!isLoading && <FiRefreshCcw className='text-md' />}
            {isLoading ? 'Loading...' : 'Refresh'}
        </button>
    );
};

export default RefreshButton;
