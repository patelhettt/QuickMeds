import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrintButton from '../../components/buttons/PrintButton';
import RefreshButton from '../../components/buttons/RefreshButton';
import DashboardPageHeading from '../../components/headings/DashboardPageHeading';
import { toast } from 'react-toastify';
import NewButton from '../../components/buttons/NewButton';
import axios from 'axios';
import AddEmployeeModal from '../../components/employees/AddEmployeeModal';
import EmployeeTable from '../../components/employees/EmployeeTable';
import EmployeeForm from '../../components/employees/EmployeeForm';

// Toast IDs to prevent duplicate notifications
const TOAST_IDS = {
    FETCH: 'employees-fetch',
    ADD: 'employee-add',
    UPDATE: 'employee-update',
    ERROR: 'employee-error'
};

const Employees = () => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [userCity, setUserCity] = useState('');
    const [userStore, setUserStore] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // Function to show toasts with IDs to prevent duplicates
    const showToast = (message, type = 'info', toastId) => {
        if (toastId) {
            toast.dismiss(toastId);
        }
        
        const toastOptions = {
            toastId,
            autoClose: 5000,
            pauseOnHover: true
        };
        
        switch(type) {
            case 'success':
                return toast.success(message, toastOptions);
            case 'error':
                return toast.error(message, toastOptions);
            case 'warning':
                return toast.warning(message, toastOptions);
            case 'info':
            default:
                return toast.info(message, toastOptions);
        }
    };

    useEffect(() => {
        // Check authentication and role
        const userString = localStorage.getItem('user');
        if (!token || !userString) {
            showToast("Please login to access this page", 'error', TOAST_IDS.ERROR);
            navigate('/login', { state: { from: '/admin-dashboard' } });
            return;
        }

        try {
            const userData = JSON.parse(userString);
            // Always store and compare roles in lowercase
            const currentRole = (userData.role || '').toLowerCase();

            if (currentRole !== 'admin') {
                showToast("Access denied. Only admins can view this page.", 'error', TOAST_IDS.ERROR);
                // Redirect based on lowercase role comparison
                if (currentRole === 'employee') {
                    navigate('/employee-dashboard');
                } else if (currentRole === 'superadmin') {
                    navigate('/dashboard');
                } else {
                    navigate('/login');
                }
                return;
            }

            // Store the role in lowercase
            setUserRole(currentRole);
            setUserCity(userData.city || '');
            setUserStore(userData.store_name || '');
            fetchEmployees();
        } catch (error) {
            console.error("Error parsing user data:", error);
            showToast("Error loading user profile", 'error', TOAST_IDS.ERROR);
            navigate('/login');
        }

        setIsLoading(false);
    }, [navigate, token]);

    // Fetch employees from API
    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            showToast("Loading employees...", 'info', TOAST_IDS.FETCH);
            
            const response = await axios.get(`${API_URL}/api/products/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Filter employees using lowercase role comparison
            const filteredEmployees = response.data.filter(emp => emp.role.toLowerCase() === 'employee');
            setEmployees(filteredEmployees);
            
            toast.dismiss(TOAST_IDS.FETCH);
            showToast(`Loaded ${filteredEmployees.length} employees`, 'success', TOAST_IDS.FETCH);
            
            setIsLoading(false);
        } catch (error) {
            console.error("Fetch employees error:", error);
            showToast("Failed to load employees. Please check your connection.", 'error', TOAST_IDS.ERROR);
            setIsLoading(false);
        }
    };

    // Handle opening the add employee modal
    const handleOpenAddModal = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        
        setModalOpen(true);
        
        const modalElement = document.getElementById('create-new-product');
        if (modalElement) {
            modalElement.checked = true;
        } else {
            console.error("Modal element not found");
            showToast("Could not open the add employee form", 'error', TOAST_IDS.ERROR);
        }
    };

    // Add new employee
    const addEmployee = async (event, formData) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Always set role to lowercase
            formData.role = 'employee';
            
            // Ensure city and store match admin's if admin
            if (userRole === 'admin') {
                formData.city = userCity;
                formData.store_name = userStore;
            }

            // Validate phone format
            const phoneDigits = formData.phone.replace(/[-()\s]/g, '');
            if (!/^\d{10}$/.test(phoneDigits)) {
                showToast("Phone number must be exactly 10 digits", 'error', TOAST_IDS.ERROR);
                setIsLoading(false);
                return;
            }

            // Validate names contain only alphabets
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
                showToast("Names should contain only alphabets", 'error', TOAST_IDS.ERROR);
                setIsLoading(false);
                return;
            }

            // Validate password
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                showToast("Password must be at least 8 characters and include uppercase, lowercase, number, and special character", 'error', TOAST_IDS.ERROR);
                setIsLoading(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                showToast("Passwords do not match", 'error', TOAST_IDS.ERROR);
                setIsLoading(false);
                return;
            }

            const response = await axios.post(`${API_URL}/api/products/auth/register`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            showToast(`Employee ${formData.firstName} ${formData.lastName} added successfully`, 'success', TOAST_IDS.ADD);
            fetchEmployees();
            
            const modalElement = document.getElementById('create-new-product');
            if (modalElement) {
                modalElement.checked = false;
            }
            setModalOpen(false);
            setIsLoading(false);
        } catch (error) {
            console.error("Add employee error:", error);
            showToast(error.response?.data?.message || "Failed to add employee", 'error', TOAST_IDS.ERROR);
            setIsLoading(false);
        }
    };

    // Handle edit employee
    const handleEdit = (employee) => {
        console.log("Edit button clicked for employee:", employee);
        setEditingEmployee(employee);
        setIsEditing(true);
        
        const modalElement = document.getElementById('edit-product');
        if (modalElement) {
            modalElement.checked = true;
        } else {
            console.error("Edit modal element not found");
            showToast("Could not open the edit form", 'error', TOAST_IDS.ERROR);
        }
    };

    // Update employee
    const handleUpdate = async (event, formData) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Always set role to lowercase
            formData.role = 'employee';
            
            // Ensure city and store match admin's if admin
            if (userRole === 'admin') {
                formData.city = userCity;
                formData.store_name = userStore;
            }

            // Validate phone format
            const phoneDigits = formData.phone.replace(/[-()\s]/g, '');
            if (!/^\d{10}$/.test(phoneDigits)) {
                showToast("Phone number must be exactly 10 digits", 'error', TOAST_IDS.ERROR);
                setIsLoading(false);
                return;
            }

            // Validate names contain only alphabets
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
                showToast("Names should contain only alphabets", 'error', TOAST_IDS.ERROR);
                setIsLoading(false);
                return;
            }

            // Validate password if provided
            if (formData.password) {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!passwordRegex.test(formData.password)) {
                    showToast("Password must be at least 8 characters and include uppercase, lowercase, number, and special character", 'error', TOAST_IDS.ERROR);
                    setIsLoading(false);
                    return;
                }
                
                if (formData.password !== formData.confirmPassword) {
                    showToast("Passwords do not match", 'error', TOAST_IDS.ERROR);
                    setIsLoading(false);
                    return;
                }
            }

            // Create a copy of formData without password fields if empty
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
                delete updateData.confirmPassword;
            } else {
                delete updateData.confirmPassword;
            }

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
                showToast("Employee updated successfully", 'success', TOAST_IDS.UPDATE);
                fetchEmployees();
                handleCancelEdit();
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Update error:", error);
            if (error.response?.status === 401) {
                showToast("Session expired. Please login again.", 'error', TOAST_IDS.ERROR);
            } else {
                showToast(error.response?.data?.message || "Failed to update employee", 'error', TOAST_IDS.ERROR);
            }
            setIsLoading(false);
        }
    };

    // Cancel handlers
    const handleCancel = () => {
        const modalElement = document.getElementById('create-new-product');
        if (modalElement) {
            modalElement.checked = false;
        }
        setModalOpen(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingEmployee(null);
        const modalElement = document.getElementById('edit-product');
        if (modalElement) {
            modalElement.checked = false;
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <section className='p-4 mt-16'>
                    <div>
                        <DashboardPageHeading
                            className='fixed top-0 left-0 right-0'
                            name='Employees'
                            value={`My City: ${userCity} | My Store: ${userStore}`}
                            buttons={[
                                <NewButton 
                                    key="new-employee" 
                                    modalId='create-new-product' 
                                    onRefresh={handleOpenAddModal}
                                    btnSize="btn-sm"
                                    title="New Employee"
                                    className="block md:hidden"
                                />,
                                <RefreshButton key="refresh" onClick={fetchEmployees} />,
                                <PrintButton key="print" />
                            ]}
                        />

                        {/* Add Employee Modal */}
                        <input type="checkbox" id="create-new-product" className="modal-toggle" />
                        <div className="modal" role="dialog">
                            <AddEmployeeModal 
                                onSubmit={addEmployee}
                                onCancel={handleCancel}
                                userRole={userRole}
                                userCity={userCity}
                                userStore={userStore}
                            />
                        </div>

                        {/* Edit Employee Modal */}
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

                    {/* Employee Table */}
                    <EmployeeTable
                        employees={employees}
                        userRole={userRole}
                        userCity={userCity}
                        userStore={userStore}
                        onEdit={handleEdit}
                        apiUrl={API_URL}
                    />
                </section>
            )}
        </>
    );
};

export default Employees;
