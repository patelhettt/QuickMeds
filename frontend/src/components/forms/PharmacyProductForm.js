import React, { useState, useEffect } from 'react';
import Input from '../form/Input';
import SaveButton from '../buttons/SaveButton';
import { toast } from 'react-toastify';

const PharmacyProductForm = ({ 
    isEdit = false, 
    productData, 
    categories = [], 
    companies = [], 
    unitTypes = [],
    onSubmit,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        tradeName: '',
        genericName: '',
        strength: '',
        category: '',
        company: '',
        unitType: '',
        stock: 0
    });

    useEffect(() => {
        if (productData) {
            setFormData({
                tradeName: productData.tradeName || '',
                genericName: productData.genericName || '',
                strength: productData.strength || '',
                category: productData.category || '',
                company: productData.company || '',
                unitType: productData.unitType || '',
                stock: productData.stock || 0
            });
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'stock') {
            const stockValue = parseInt(value);
            if (stockValue < 0) {
                toast.error('Stock cannot be negative');
                return;
            }
            if (stockValue > 50000) {
                toast.error('Stock cannot exceed 50,000');
                return;
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Helper function to get the display and value for select options
    const getOptionValue = (item) => {
        if (typeof item === 'string') return item;
        return item.Name || '';
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4'>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Trade Name</span>
                    </label>
                    <input
                        type="text"
                        name="tradeName"
                        className="input input-bordered w-full"
                        value={formData.tradeName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Generic Name</span>
                    </label>
                    <input
                        type="text"
                        name="genericName"
                        className="input input-bordered w-full"
                        value={formData.genericName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Strength</span>
                    </label>
                    <input
                        type="text"
                        name="strength"
                        className="input input-bordered w-full"
                        value={formData.strength}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Category</span>
                    </label>
                    <select
                        name="category"
                        className="select select-bordered w-full"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={getOptionValue(category)}>
                                {getOptionValue(category)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Company</span>
                    </label>
                    <select
                        name="company"
                        className="select select-bordered w-full"
                        value={formData.company}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Company</option>
                        {companies.map((company, index) => (
                            <option key={index} value={getOptionValue(company)}>
                                {getOptionValue(company)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Unit Type</span>
                    </label>
                    <select
                        name="unitType"
                        className="select select-bordered w-full"
                        value={formData.unitType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Unit Type</option>
                        {unitTypes.map((unitType, index) => (
                            <option key={index} value={getOptionValue(unitType)}>
                                {getOptionValue(unitType)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Stock</span>
                    </label>
                    <input
                        type="number"
                        name="stock"
                        className="input input-bordered w-full"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        max="50000"
                        onKeyPress={(e) => {
                            if (e.key === '-' || e.key === '+' || e.key === 'e') {
                                e.preventDefault();
                            }
                        }}
                    />
                    <label className="label">
                        <span className="label-text-alt text-gray-500">Maximum value: 50,000</span>
                    </label>
                </div>
            </div>

            <div className="modal-action flex items-center gap-2">
                <SaveButton type="submit" extraClass={'btn-primary'} />
                <button 
                    type="button"
                    className="btn btn-outline btn-sm px-4"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default PharmacyProductForm; 