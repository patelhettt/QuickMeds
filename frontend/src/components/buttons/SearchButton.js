import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchButton = ({ btnSize = 'btn-xs', onClick }) => {
    return (
        <button className={`btn ${btnSize} flex gap-x-2`} onClick={onClick}>
            <FiSearch className='text-md' />
            Search
        </button>
    );
};

export default SearchButton; 