import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import PrintButton from '../../../components/buttons/PrintButton';
import RefreshButton from '../../../components/buttons/RefreshButton';
import SearchButton from '../../../components/buttons/SearchButton';
import NewButton from '../../../components/buttons/NewButton';
import EmployeeForm from '../../../components/employees/EmployeeForm';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Toast IDs to prevent duplicate notifications
const TOAST_IDS = {
    FETCH: 'users-fetch',
    ADD: 'user-add',
    UPDATE: 'user-update',
    ERROR: 'user-error'
};

const Users = () => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const token = localStorage.getItem('token');

    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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

    // Fetch users from API
    const fetchUsers = async (page = currentPage) => {
        setIsLoading(true);
        try {
            showToast("Loading store admins...", 'info', TOAST_IDS.FETCH);
            
            const response = await axios.get(`${API_URL}/api/products/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Filter users to only include those with role 'admin' or 'Admin'
            const adminUsers = response.data.filter(user => 
                user.role?.toLowerCase() === 'admin'
            );
            
            setUsers(adminUsers);
            setTotalUsers(adminUsers.length);
            setTotalPages(Math.ceil(adminUsers.length / usersPerPage));
            
            toast.dismiss(TOAST_IDS.FETCH);
            showToast(`Loaded ${adminUsers.length} store admins`, 'success', TOAST_IDS.FETCH);
            
            setIsLoading(false);
        } catch (error) {
            console.error("Fetch users error:", error);
            showToast("Failed to load store admins. Please check your connection.", 'error', TOAST_IDS.ERROR);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    // Handle search
    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`${API_URL}/api/products/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const filteredUsers = response.data.filter(user => 
                (user.role?.toLowerCase() === 'admin') && 
                (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone?.includes(searchTerm))
            );
            
            setUsers(filteredUsers);
            setTotalUsers(filteredUsers.length);
            setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
            setIsSearching(false);
        } catch (error) {
            toast.error('Search failed');
        }
    };

    // Add new user
    const addUser = async (event, formData) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Force admin role and store type for new users
            formData.role = 'admin';
            formData.type = 'store';

            const response = await axios.post(`${API_URL}/api/products/auth/register`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            showToast(`Store admin ${formData.firstName} ${formData.lastName} added successfully`, 'success', TOAST_IDS.ADD);
            fetchUsers();
            
            const modalElement = document.getElementById('create-new-product');
            if (modalElement) {
                modalElement.checked = false;
            }
            setModalOpen(false);
            setIsLoading(false);
        } catch (error) {
            console.error("Add user error:", error);
            showToast(error.response?.data?.message || "Failed to add store admin", 'error', TOAST_IDS.ERROR);
            setIsLoading(false);
        }
    };

    // Handle edit user
    const handleEdit = (user) => {
        console.log("Edit button clicked for user:", user);
        setEditingUser(user);
        setIsEditing(true);
        
        const modalElement = document.getElementById('edit-product');
        if (modalElement) {
            modalElement.checked = true;
        } else {
            console.error("Edit modal element not found");
            showToast("Could not open the edit form", 'error', TOAST_IDS.ERROR);
        }
    };

    // Update user
    const handleUpdate = async (event, formData) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Force admin role and store type
            formData.role = 'admin';
            formData.type = 'store';

            // Create a copy of formData without password fields if empty
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
                delete updateData.confirmPassword;
            } else {
                delete updateData.confirmPassword;
            }

            const response = await axios.put(
                `${API_URL}/api/products/employees/${editingUser._id}`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                showToast("Store admin updated successfully", 'success', TOAST_IDS.UPDATE);
                fetchUsers();
                handleCancelEdit();
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Update error:", error);
            if (error.response?.status === 401) {
                showToast("Session expired. Please login again.", 'error', TOAST_IDS.ERROR);
            } else {
                showToast(error.response?.data?.message || "Failed to update store admin", 'error', TOAST_IDS.ERROR);
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
        setEditingUser(null);
        const modalElement = document.getElementById('edit-product');
        if (modalElement) {
            modalElement.checked = false;
        }
    };

    // Add handleDelete function
    const handleDelete = async (userId) => {
        try {
            const response = await axios.delete(`${API_URL}/api/products/employees/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                showToast("Store admin deleted successfully", 'success');
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error("Delete error:", error);
            showToast(
                error.response?.data?.message || "Failed to delete store admin", 
                'error', 
                TOAST_IDS.ERROR
            );
        }
    };

    return (
        <section className='p-4 mt-16'>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold">Store Admins</h2>
                    <p className="text-gray-600">Total: {totalUsers}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        className="btn btn-primary btn-sm px-4 h-9 min-h-[36px]"
                        onClick={() => {
                            setEditingUser(null);
                            setModalOpen(true);
                        }}
                    >
                        + New Admin
                    </button>
                    <SearchButton className="btn-sm px-4 h-9 min-h-[36px]" onClick={() => setIsSearching(true)} />
                    <RefreshButton className="btn-sm px-4 h-9 min-h-[36px]" onClick={fetchUsers} />
                    <PrintButton className="btn-sm px-4 h-9 min-h-[36px]" />
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th className="hidden lg:table-cell">SN</th>
                            <th>Name</th>
                            <th className="hidden md:table-cell">Email</th>
                            <th className="hidden sm:table-cell">Phone</th>
                            <th className="hidden lg:table-cell">Store</th>
                            <th>City</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage).map((user, index) => (
                            <tr key={user._id}>
                                <td className="hidden lg:table-cell">
                                    {(currentPage - 1) * usersPerPage + index + 1}
                                </td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td className="hidden md:table-cell">{user.email}</td>
                                <td className="hidden sm:table-cell">{user.phone}</td>
                                <td className="hidden lg:table-cell">{user.store_name || '-'}</td>
                                <td>{user.city || '-'}</td>
                                <td>
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            className="btn btn-sm h-9 min-h-[36px] w-9 btn-info"
                                            onClick={() => handleEdit(user)}
                                        >
                                            <FaEdit className="text-base" />
                                        </button>
                                        <button
                                            className="btn btn-sm h-9 min-h-[36px] w-9 btn-error"
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this admin?')) {
                                                    handleDelete(user._id);
                                                }
                                            }}
                                        >
                                            <FaTrash className="text-base" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                    <button
                        className="btn btn-sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
                        .map((page) => (
                            <button
                                key={page}
                                className={`btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    <button
                        className="btn btn-sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Add User Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => {
                            setModalOpen(false);
                            setEditingUser(null);
                        }}></div>
                        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">
                                    Add New Store Admin
                                </h3>
                                <button 
                                    className="btn btn-sm btn-circle"
                                    onClick={() => {
                                        setModalOpen(false);
                                        setEditingUser(null);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            <EmployeeForm 
                                onSubmit={addUser}
                                onCancel={() => {
                                    setModalOpen(false);
                                    setEditingUser(null);
                                }}
                                isEditing={false}
                                userRole="superadmin"
                                isSuperadmin={true}
                                isStoreAdmin={true}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditing && editingUser && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => {
                            setIsEditing(false);
                            setEditingUser(null);
                        }}></div>
                        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">
                                    Edit Store Admin
                                </h3>
                                <button 
                                    className="btn btn-sm btn-circle"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingUser(null);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            <EmployeeForm 
                                employee={editingUser}
                                onSubmit={handleUpdate}
                                onCancel={() => {
                                    setIsEditing(false);
                                    setEditingUser(null);
                                }}
                                isEditing={true}
                                userRole="superadmin"
                                isSuperadmin={true}
                                isStoreAdmin={true}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Search Modal */}
            {isSearching && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSearching(false)}></div>
                        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Search Admins</h3>
                                <button 
                                    className="btn btn-sm btn-circle"
                                    onClick={() => setIsSearching(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    className="input input-bordered w-full mb-4"
                                    placeholder="Search by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="flex justify-end gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Search
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn"
                                        onClick={() => setIsSearching(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Users;
