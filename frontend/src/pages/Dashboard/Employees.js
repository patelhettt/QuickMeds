import React, { useEffect, useState } from 'react';
import PrintButton from '../../components/buttons/PrintButton';
import RefreshButton from '../../components/buttons/RefreshButton';
import DashboardPageHeading from '../../components/headings/DashboardPageHeading';
import { toast } from 'react-toastify';
import NewButton from '../../components/buttons/NewButton';
import axios from 'axios';
import AddEmployeeModal from '../../components/employees/AddEmployeeModal';
import EmployeeTable from '../../components/employees/EmployeeTable';
import EmployeeForm from '../../components/employees/EmployeeForm';

const Employees = () => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const token = localStorage.getItem('token');

    const [employees, setEmployees] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [userCity, setUserCity] = useState('');
    const [userStore, setUserStore] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Get user info from localStorage
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                console.log("User data from localStorage:", userData);
                setUserRole(userData.role || '');
                setUserCity(userData.city || '');
                setUserStore(userData.store_name || '');
            } catch (error) {
                console.error("Error parsing user data:", error);
                toast.error("Error loading user profile");
            }
        }
        
        fetchEmployees();
    }, []);

    // Fetch employees from API
    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/products/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Fetched employees:", response.data);
            setEmployees(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Fetch employees error:", error);
            toast.error("Failed to load users. Please check your connection.");
            setIsLoading(false);
        }
    };

    // Add new employee with enhanced validation
    const addEmployee = async (event, formData) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Additional validation check before submitting
            if (userRole === 'admin') {
                // Enforce admin restrictions
                if (formData.city !== userCity) {
                    toast.error("Admin can only add employees to their own city");
                    setIsLoading(false);
                    return;
                }
                if (formData.store_name !== userStore) {
                    toast.error("Admin can only add employees to their own store");
                    setIsLoading(false);
                    return;
                }
                if (formData.role !== 'employee') {
                    toast.error("Admin can only create employee accounts");
                    setIsLoading(false);
                    return;
                }
            }

            // Validate phone format
            const phoneDigits = formData.phone.replace(/[-()\s]/g, '');
            if (!/^\d{10}$/.test(phoneDigits)) {
                toast.error("Phone number must be exactly 10 digits");
                setIsLoading(false);
                return;
            }

            // Validate names contain only alphabets
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
                toast.error("Names should contain only alphabets");
                setIsLoading(false);
                return;
            }

            // Validate password if creating a new user
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
                setIsLoading(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                setIsLoading(false);
                return;
            }

            const response = await axios.post(`${API_URL}/api/products/auth/register`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success(`User ${formData.firstName} ${formData.lastName} added successfully`);
            fetchEmployees();
            document.getElementById('create-new-product').checked = false;
            setIsLoading(false);
        } catch (error) {
            console.error("Add employee error:", error);
            toast.error(error.response?.data?.message || "Failed to add user");
            setIsLoading(false);
        }
    };

    // Handle edit employee
    const handleEdit = (employee) => {
        console.log("Edit button clicked for employee:", employee);
        setEditingEmployee(employee);
        setIsEditing(true);
        document.getElementById('edit-product').checked = true;
    };

    // Update employee with enhanced validation
    const handleUpdate = async (event, formData) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Additional validation check before submitting
            if (userRole === 'admin') {
                // Enforce admin restrictions
                if (formData.city !== userCity) {
                    toast.error("Admin can only update employees in their own city");
                    setIsLoading(false);
                    return;
                }
                if (formData.store_name !== userStore) {
                    toast.error("Admin can only update employees in their own store");
                    setIsLoading(false);
                    return;
                }
                // Prevent admin from changing employee role
                if (editingEmployee.role === 'employee' && formData.role !== 'employee') {
                    toast.error("Admin cannot change employee role");
                    setIsLoading(false);
                    return;
                }
                // Prevent admin from editing other admins
                if (editingEmployee.role === 'admin') {
                    toast.error("Admin cannot edit other admin accounts");
                    setIsLoading(false);
                    return;
                }
            }

            // Validate phone format
            const phoneDigits = formData.phone.replace(/[-()\s]/g, '');
            if (!/^\d{10}$/.test(phoneDigits)) {
                toast.error("Phone number must be exactly 10 digits");
                setIsLoading(false);
                return;
            }

            // Validate names contain only alphabets
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
                toast.error("Names should contain only alphabets");
                setIsLoading(false);
                return;
            }

            // Validate password if provided
            if (formData.password) {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!passwordRegex.test(formData.password)) {
                    toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
                    setIsLoading(false);
                    return;
                }
                
                if (formData.password !== formData.confirmPassword) {
                    toast.error("Passwords do not match");
                    setIsLoading(false);
                    return;
                }
            }

            // Create a copy of formData without password fields if empty
            const updateData = { ...formData };
            
            // Remove password fields if they're empty (not being updated)
            if (!updateData.password) {
                delete updateData.password;
                delete updateData.confirmPassword;
            } else {
                // Only need to send the password, not the confirmation
                delete updateData.confirmPassword;
            }

            // Use the correct API endpoint for updating employees
            const response = await axios.put(
                `${API_URL}/api/products/employees/${editingEmployee._id}`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                toast.success("Employee updated successfully");
                fetchEmployees();
                handleCancelEdit();
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Update error:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
            } else {
                toast.error(error.response?.data?.message || "Failed to update employee");
            }
            setIsLoading(false);
        }
    };

    // Cancel handlers
    const handleCancel = () => {
        document.getElementById('create-new-product').checked = false;
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingEmployee(null);
        document.getElementById('edit-product').checked = false;
    };

    return (
        <section className='p-4 mt-16'>
            <div>
                <DashboardPageHeading
                    className='fixed top-0 left-0 right-0'
                    name='Employees'
                    value={userRole === 'admin' ? `My City: ${userCity} | My Store: ${userStore}` : employees.length}
                    buttons={[
                        <NewButton key="new" modalId='create-new-product' />,
                        <RefreshButton key="refresh" onClick={fetchEmployees} />,
                        <PrintButton key="print" />
                    ]}
                />

                {/* Add Employee Modal */}
                <input type="checkbox" id="create-new-product" className="modal-toggle" />
                <div className="modal" role="dialog">
                    <AddEmployeeModal 
                        onSubmit={addEmployee}
                        onCancel={() => document.getElementById('create-new-product').checked = false}
                        userRole={userRole}
                        userCity={userCity}
                        userStore={userStore}
                    />
                </div>

                {/* Edit Employee Modal - Using the same structure as Add Employee */}
                <input type="checkbox" id="edit-product" className="modal-toggle" />
                <div className="modal" role="dialog">
                    <div className="modal-box w-11/12 max-w-5xl mx-auto">
                        <div className='flex mb-3'>
                            <h3 className="font-bold text-lg">Edit Employee</h3>
                        </div>
                        {editingEmployee && (
                            <EmployeeForm 
                                employee={editingEmployee}
                                onSubmit={handleUpdate}
                                onCancel={handleCancelEdit}
                                isEditing={true}
                                userRole={userRole}
                                userCity={userCity}
                                userStore={userStore}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4">
                {/* Debug information */}
                <p className="text-xs text-gray-500 mb-2">
                    Current user role: {userRole || 'Not set'} | 
                    City: {userCity || 'Not set'} | 
                    Store: {userStore || 'Not set'}
                </p>
            </div>

            {/* Employee Table */}
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <EmployeeTable
                    employees={employees}
                    userRole={userRole || 'superadmin'} // Force superadmin if role is not set
                    userCity={userCity}
                    userStore={userStore}
                    onEdit={handleEdit}
                    apiUrl={API_URL}
                />
            )}
        </section>
    );
};

export default Employees;
