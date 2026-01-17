import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SaveButton from '../../../components/buttons/SaveButton';

const UserForm = ({ 
    isEdit = false, 
    userData, 
    onSubmit,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // Validate phone number (assuming 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        // If not editing, check password
        if (!isEdit) {
            if (formData.password.length < 6) {
                toast.error('Password must be at least 6 characters long');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
        }

        // Remove password fields if they're empty in edit mode
        const submitData = { ...formData };
        if (isEdit && !submitData.password) {
            delete submitData.password;
            delete submitData.confirmPassword;
        }

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className='space-y-4'>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        className="input input-bordered w-full"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        className="input input-bordered w-full"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Phone</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        className="input input-bordered w-full"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        pattern="\d{10}"
                        title="Please enter a valid 10-digit phone number"
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Password {isEdit && '(Leave blank to keep unchanged)'}</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="input input-bordered w-full"
                        value={formData.password}
                        onChange={handleChange}
                        required={!isEdit}
                        minLength={6}
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Confirm Password {isEdit && '(Leave blank to keep unchanged)'}</span>
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="input input-bordered w-full"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required={!isEdit}
                        minLength={6}
                    />
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

export default UserForm; 