import React from 'react';

const Input = ({ title, name, isRequired, type, value, onChange, placeholder, disabled }) => {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">
                    {title} {isRequired && <span className="text-red-500">*</span>}
                </span>
            </label>
            <input
                type={type}
                name={name}
                className="input input-bordered"
                value={value || ''}
                onChange={onChange}
                required={isRequired}
                placeholder={placeholder || title}
                disabled={disabled}
            />
        </div>
    );
};

export default Input;