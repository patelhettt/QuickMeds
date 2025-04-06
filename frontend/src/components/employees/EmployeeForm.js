import React, { useState, useEffect } from 'react';
import Input from '../../components/form/Input';
import SaveButton from '../../components/buttons/SaveButton';
import CancelButton from '../../components/buttons/CancelButton';

const EmployeeForm = ({ employee, onSubmit, onCancel, isEditing = false, userRole, userCity, userStore }) => {
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: isEditing && employee ? employee.firstName || '' : '',
        lastName: isEditing && employee ? employee.lastName || '' : '',
        email: isEditing && employee ? employee.email || '' : '',
        phone: isEditing && employee ? employee.phone || '' : '',
        city: userRole === 'admin' ? userCity : (isEditing && employee ? employee.city || '' : ''),
        store_name: userRole === 'admin' ? userStore : (isEditing && employee ? employee.store_name || '' : ''),
        role: userRole === 'admin' ? 'employee' : (isEditing && employee ? employee.role || 'employee' : 'employee'),
        password: '',
        confirmPassword: ''
    });

    // Update form data if employee prop changes
    useEffect(() => {
        if (isEditing && employee) {
            setFormData({
                firstName: employee.firstName || '',
                lastName: employee.lastName || '',
                email: employee.email || '',
                phone: employee.phone || '',
                city: userRole === 'admin' ? userCity : (employee.city || ''),
                store_name: userRole === 'admin' ? userStore : (employee.store_name || ''),
                role: userRole === 'admin' ? 'employee' : (employee.role || 'employee'),
                password: '',
                confirmPassword: ''
            });
        } else if (!isEditing) {
            // For add employee, ensure admin values are set
            if (userRole === 'admin') {
                setFormData(prev => ({
                    ...prev,
                    city: userCity,
                    store_name: userStore,
                    role: 'employee'
                }));
            }
        }
    }, [employee, isEditing, userRole, userCity, userStore]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear the specific error when field is edited
        if (formErrors[name]) {
            setFormErrors(prev => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };
    
    const validateForm = () => {
        const errors = {};
        
        // First Name validation - only alphabets
        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required";
        } else if (!/^[A-Za-z\s]+$/.test(formData.firstName)) {
            errors.firstName = "First name should contain only alphabets";
        }
        
        // Last Name validation - only alphabets
        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required";
        } else if (!/^[A-Za-z\s]+$/.test(formData.lastName)) {
            errors.lastName = "Last name should contain only alphabets";
        }
        
        // Email validation
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Please enter a valid email address";
        }
        
        // Phone validation - exactly 10 digits
        if (!formData.phone.trim()) {
            errors.phone = "Phone number is required";
        } else {
            const phoneDigits = formData.phone.replace(/[-()\s]/g, '');
            if (!/^\d{10}$/.test(phoneDigits)) {
                errors.phone = "Phone number must be exactly 10 digits";
            }
        }
        
        // City validation for all users
        if (!formData.city.trim()) {
            errors.city = "City is required";
        } else if (userRole === 'admin' && formData.city !== userCity) {
            // For admins, must match their city
            errors.city = "As an admin, you can only add employees to your city";
        }
        
        // Store validation for all users
        if (!formData.store_name.trim()) {
            errors.store_name = "Store name is required";
        } else if (userRole === 'admin' && formData.store_name !== userStore) {
            // For admins, must match their store
            errors.store_name = "As an admin, you can only add employees to your store";
        }
        
        // Password validation - only for adding new employees
        if (!isEditing) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            
            if (!formData.password) {
                errors.password = "Password is required";
            } else if (!passwordRegex.test(formData.password)) {
                errors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
            }
            
            // Confirm password validation
            if (!formData.confirmPassword) {
                errors.confirmPassword = "Please confirm your password";
            } else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }
        }
        
        // Role validation
        if (!formData.role) {
            errors.role = "Role is required";
        } else if (userRole === 'admin' && formData.role !== 'employee') {
            errors.role = "Admin users can only create employee accounts";
        }
        
        return errors;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Force city and store to userCity and userStore for admin users
        const submissionData = { ...formData };
        if (userRole === 'admin') {
            submissionData.city = userCity;
            submissionData.store_name = userStore;
            submissionData.role = 'employee';
        }
        
        const errors = validateForm();
        setFormErrors(errors);
        
        if (Object.keys(errors).length === 0) {
            // Pass a copy of the data to prevent reference issues
            onSubmit(e, { ...submissionData });
        } else {
            console.log("Form validation errors:", errors);
            // Scroll to the first error
            const firstErrorElement = document.querySelector('.text-red-500');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className='mx-auto'>
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-2 mb-2'>
                {/* First Name */}
                <div>
                    <Input 
                        title={'First Name'} 
                        name='firstName' 
                        isRequired={true}
                        type='text' 
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                    {formErrors.firstName && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>
                    )}
                </div>
                
                {/* Last Name */}
                <div>
                    <Input 
                        title={'Last Name'} 
                        name='lastName' 
                        isRequired={true}
                        type='text' 
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
                    {formErrors.lastName && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>
                    )}
                </div>
                
                {/* Email */}
                <div>
                    <Input 
                        title={'Email'} 
                        name='email' 
                        isRequired={true}
                        type='email' 
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {formErrors.email && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                    )}
                </div>
                
                {/* Phone */}
                <div>
                    <Input 
                        title={'Phone (10 digits)'} 
                        name='phone' 
                        isRequired={true}
                        type='tel' 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit phone number"
                    />
                    {formErrors.phone && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                    )}
                </div>
                
                {/* City */}
                <div>
                    <Input 
                        title={'City'} 
                        name='city' 
                        isRequired={true}
                        type='text' 
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={userRole === 'admin'}
                    />
                    {userRole === 'admin' && (
                        <p className="text-xs text-gray-500 mt-1">
                            As an admin, you can only add employees to your city: {userCity}
                        </p>
                    )}
                    {formErrors.city && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>
                    )}
                </div>
                
                {/* Store Name */}
                <div>
                    <Input 
                        title={'Store Name'} 
                        name='store_name' 
                        isRequired={true}
                        type='text' 
                        value={formData.store_name}
                        onChange={handleInputChange}
                        disabled={userRole === 'admin'}
                    />
                    {userRole === 'admin' && (
                        <p className="text-xs text-gray-500 mt-1">
                            As an admin, you can only add employees to your store: {userStore}
                        </p>
                    )}
                    {formErrors.store_name && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.store_name}</p>
                    )}
                </div>
                
                {/* Password fields - only show when adding new employee */}
                {!isEditing && (
                    <>
                        <div>
                            <Input 
                                title={'Password (8+ chars, upper/lower/number/special)'} 
                                name='password' 
                                isRequired={true}
                                type='password' 
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            {formErrors.password && (
                                <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
                            )}
                        </div>
                        
                        <div>
                            <Input 
                                title={'Confirm Password'} 
                                name='confirmPassword' 
                                isRequired={true}
                                type='password' 
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                            {formErrors.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>
                            )}
                        </div>
                    </>
                )}
                
                {/* Role Selection */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Role</span>
                    </label>
                    <select 
                        name="role" 
                        className="select select-bordered w-full" 
                        value={formData.role}
                        onChange={handleInputChange}
                        disabled={userRole === 'admin'} // Admin can only create employees
                    >
                        <option value="">Select Role</option>
                        {userRole !== 'admin' && <option value="admin">Admin</option>}
                        <option value="employee">Employee</option>
                    </select>
                    {userRole === 'admin' && (
                        <p className="text-xs text-gray-500 mt-1">
                            As an admin, you can only create employee accounts
                        </p>
                    )}
                    {formErrors.role && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.role}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                <SaveButton extraClass='mt-4' />
                <CancelButton extraClass='lg:mt-4 md:mt-3 mt-2' onClick={onCancel} type="button" />
            </div>
        </form>
    );
};

export default EmployeeForm; 