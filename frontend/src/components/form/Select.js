import React from 'react';

const Select = ({ title, name, isRequired, options, defaultValue = '' }) => {
    return (
        <div className='form-control w-full'>
            <label className='label'>
                <span className='label-text'>{title}</span>
            </label>
            <select 
                name={name} 
                className='select select-bordered w-full' 
                required={isRequired === 'required'}
                defaultValue={defaultValue}
            >
                <option value="" disabled>Select {title}</option>
                {options?.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;