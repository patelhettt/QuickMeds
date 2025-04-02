import React, { useEffect, useState } from 'react';
import PrintButton from '../../components/buttons/PrintButton';
import Input from '../../components/form/Input';
import TableRow from '../../components/TableRow';
import SaveButton from '../../components/buttons/SaveButton';
import EditButton from '../../components/buttons/EditButton';
import DeleteButton from '../../components/buttons/DeleteButton';
import RefreshButton from '../../components/buttons/RefreshButton';
import DashboardPageHeading from '../../components/headings/DashboardPageHeading';
import { toast } from 'react-toastify';
import CancelButton from '../../components/buttons/CancelButton';
import ModalHeading from '../../components/headings/ModalHeading';
import ModalCloseButton from '../../components/buttons/ModalCloseButton';
import NewButton from '../../components/buttons/NewButton';
import axios from 'axios';


const Employees = () => {
    const tableHeadItems = ['SN', 'First Name', 'Last Name', 'Email', 'Phone', 'City', 'Store Name', 'Role', 'Actions'];
    const tableHead = (
        <tr>
            {tableHeadItems?.map((tableHeadItem, index) => (
                <th key={index} className='text-xs'>
                    {tableHeadItem}
                </th>
            ))}
        </tr>
    );

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const token = localStorage.getItem('token');

    // Convert addEmployee to use axios
    const addEmployee = async (event) => {
        event.preventDefault();
        try {
            const firstName = event.target.firstName.value;
            const lastName = event.target.lastName.value;
            const email = event.target.email.value;
            const password = event.target.password.value;
            const confirmPassword = event.target.confirmPassword.value;
            const phone = event.target.phone.value;
            const city = event.target.city.value;
            const store_name = event.target.store_name.value;
            const role = event.target.role.value || 'employee';

            if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !city || !store_name || !role) {
                toast.error("All fields are required");
                return;
            }

            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            const userDetails = { firstName, lastName, email, password, confirmPassword, phone, city, store_name, role };

            const response = await axios.post(`${API_URL}/api/products/auth/register`, userDetails, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success(`User ${firstName} ${lastName} added successfully`);
            fetchEmployees();
            event.target.reset();
            document.getElementById('create-new-product').checked = false;
        } catch (error) {
            console.error("Add employee error:", error);
            toast.error(error.response?.data?.message || "Failed to add user");
        }
    };

    // Convert fetchEmployees to use axios
    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/products/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setEmployees(response.data);
        } catch (error) {
            console.error("Fetch employees error:", error);
            toast.error("Failed to load users. Please check your connection.");
        }
    };

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);


    const handleCancel = () => {
        document.getElementById('create-new-product').checked = false;
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [selectedRole, setSelectedRole] = useState(editingEmployee?.role);


    const handleEdit = (employee) => {
        console.log("Editing employee:", employee);
        setEditingEmployee(employee);
        setIsEditing(true);
        document.getElementById('edit-employee').checked = true;
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Authentication required. Please login again.");
                return;
            }

            const updatedData = {
                firstName: editingEmployee.firstName?.trim(),
                lastName: editingEmployee.lastName?.trim(),
                email: editingEmployee.email?.trim(),
                phone: editingEmployee.phone?.trim(),
                city: editingEmployee.city?.trim(),
                store_name: editingEmployee.store_name?.trim(),
                role: editingEmployee.role
            };

            // Validate all required fields
            if (!updatedData.firstName || !updatedData.lastName || !updatedData.email || 
                !updatedData.phone || !updatedData.city || !updatedData.store_name || !updatedData.role) {
                toast.error("All fields are required");
                return;
            }

            const response = await axios.put(
                `${API_URL}/api/products/employees/${editingEmployee._id}`,
                updatedData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log("Update response:", response.data);
            if (response.data) {
                toast.success("Employee updated successfully");
                fetchEmployees();
                document.getElementById('edit-employee').checked = false;
                setEditingEmployee(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Update error:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
            } else {
                toast.error(error.response?.data?.message || "Failed to update employee");
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingEmployee(null);
        document.getElementById('edit-employee').checked = false;
    };

    return (
        <section className='p-4 mt-16'>
            <div>
                <DashboardPageHeading
                    className='fixed top-0 left-0 right-0'
                    name='Employees'
                    value={employees.length}
                    buttons={[
                        <NewButton key="new" modalId='create-new-product' />,
                        <RefreshButton key="refresh" onClick={fetchEmployees} />,
                        <PrintButton key="print" />
                    ]}
                />
                <input type="checkbox" id="create-new-product" className="modal-toggle" />
                <label htmlFor="create-new-product" className="modal cursor-pointer">
                    <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative">
                        <ModalCloseButton modalId={'create-new-product'} />
                        <ModalHeading modalHeading={'Add a new Employee'} />
                        <form onSubmit={addEmployee} className='mx-auto'>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-2 mb-2'>
                                <Input title={'First Name'} name='firstName' isRequired='required' type='text' />
                                <Input title={'Last Name'} name='lastName' isRequired='required' type='text' />
                                <Input title={'Email'} name='email' isRequired='required' type='email' />
                                <Input title={'Phone'} name='phone' isRequired='required' type='tel' />
                                <Input title={'City'} name='city' isRequired='required' type='text' />
                                <Input title={'Store Name'} name='store_name' isRequired='required' type='text' />
                                <Input title={'Password'} name='password' isRequired='required' type='password' />
                                <Input title={'Confirm Password'} name='confirmPassword' isRequired='required' type='password' />
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Role</span>
                                    </label>
                                    <select name="role" className="select select-bordered w-full" defaultValue="employee" required>
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="employee">Employee</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                                <SaveButton extraClass='mt-4' />
                                <CancelButton extraClass='lg:mt-4 md:mt-3 mt-2' onClick={handleCancel} type="button" />
                            </div>
                        </form>
                    </label>
                </label>
            </div>
            <table className="table table-zebra table-compact w-full">
                <thead>{tableHead}</thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <TableRow
                            key={employee._id}
                            tableRowsData={[
                                index + 1,
                                employee.firstName,
                                employee.lastName,
                                employee.email,
                                employee.phone || 'N/A',
                                employee.city || 'N/A',
                                employee.store_name || 'N/A',
                                employee.role,
                                <span className='flex items-center gap-x-1'>
                                    <EditButton onClick={() => handleEdit(employee)} />
                                    <DeleteButton
                                        deleteApiLink={`${API_URL}/api/products/employees/${employee._id}`}
                                        name={`${employee.firstName} ${employee.lastName}`}
                                    />
                                </span>,
                            ]}
                        />
                    ))}
                </tbody>
            </table>


            <input type="checkbox" id="edit-employee" className="modal-toggle" />
            <label htmlFor="edit-employee" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative">
                    <ModalCloseButton modalId={'edit-employee'} />
                    <ModalHeading modalHeading={'Edit Employee'} />
                    {editingEmployee && (
                        <form onSubmit={handleUpdate} className='mx-auto'>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-2 mb-2'>
                                <Input
                                    title={'First Name'}
                                    name='firstName'

                                    type='text'
                                    value={editingEmployee.firstName || ''}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, firstName: e.target.value })}
                                />
                                <Input
                                    title={'Last Name'}
                                    name='lastName'

                                    type='text'
                                    value={editingEmployee.lastName || ''}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, lastName: e.target.value })}
                                />
                                <Input
                                    title={'Email'}
                                    name='email'

                                    type='email'
                                    value={editingEmployee.email || ''}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                                />
                                <Input
                                    title={'Phone'}
                                    name='phone'
                                    isRequired='required'
                                    type='tel'
                                    value={editingEmployee.phone || ''}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                                />
                                <Input
                                    title={'City'}
                                    name='city'
                                    isRequired='required'
                                    type='text'
                                    value={editingEmployee.city || ''}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, city: e.target.value })}
                                />
                                <Input
                                    title={'Store Name'}
                                    name='store_name'
                                    isRequired='required'
                                    type='text'
                                    value={editingEmployee.store_name || ''}
                                    onChange={(e) => setEditingEmployee({ ...editingEmployee, store_name: e.target.value })}
                                />
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Role</span>
                                    </label>
                                    <select
                                        name="role"
                                        className="select select-bordered w-full"
                                        value={editingEmployee.role || ''}
                                        onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="employee">Employee</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                                <SaveButton extraClass='mt-4' />
                                <CancelButton extraClass='lg:mt-4 md:mt-3 mt-2' onClick={handleCancelEdit} type="button" />
                            </div>
                        </form>
                    )}
                </label>
            </label>
        </section>
    );
};

export default Employees;
