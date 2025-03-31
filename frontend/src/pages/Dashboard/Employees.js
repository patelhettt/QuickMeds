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
import AddModal from '../../components/modals/AddModal';

const Employees = () => {
    const tableHeadItems = ['SN', 'First Name', 'Last Name', 'Email', 'Role', 'Actions'];
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

    const addEmployee = async (event) => {
        event.preventDefault();
        try {
            const firstName = event.target.firstName.value;
            const lastName = event.target.lastName.value;
            const email = event.target.email.value;
            const password = event.target.password.value;
            const confirmPassword = event.target.confirmPassword.value;
            const role = event.target.role.value || 'employee';

            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                toast.error("All fields are required");
                return;
            }

            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            const userDetails = { firstName, lastName, email, password, confirmPassword, role };

            const response = await fetch(`${API_URL}/api/products/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userDetails),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`User ${firstName} ${lastName} added successfully`);
                fetchEmployees();
                event.target.reset();
                document.getElementById('create-new-product').checked = false;
            } else {
                toast.error(data.message || "Failed to add user");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    const [employees, setEmployees] = useState([]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_URL}/api/products/employees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            
            const data = await response.json();
            
            setEmployees(data);
        } catch (error) {
            toast.error("Failed to load users. Please check your connection.");
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleCancel = () => {
        document.getElementById('create-new-product').checked = false;
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
                                employee.role,
                                <span className='flex items-center gap-x-1'>
                                    <EditButton />
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
        </section>
    );
};

export default Employees;