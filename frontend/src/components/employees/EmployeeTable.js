import React from 'react';
import TableRow from '../../components/TableRow';
import EditButton from '../../components/buttons/EditButton';
import DeleteButton from '../../components/buttons/DeleteButton';

const EmployeeTable = ({ employees, userRole, userCity, userStore, onEdit, apiUrl }) => {
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
    
    return (
        <table className="table table-zebra table-compact w-full">
            <thead>{tableHead}</thead>
            <tbody>
                {employees
                    .filter(employee =>
                        userRole === 'admin'  // Only apply filter for admins
                            ? employee.city === userCity && employee.store_name === userStore 
                            : true  // Show all for superadmin and other roles
                    )
                    .map((employee, index) => (
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
                                    {/* Always show edit button for now to debug */}
                                    <EditButton 
                                        onClick={() => {
                                            console.log("Edit button clicked for:", employee.firstName);
                                            onEdit(employee);
                                        }} 
                                    />
                                    <DeleteButton
                                        deleteApiLink={`${apiUrl}/api/products/employees/${employee._id}`}
                                        name={`${employee.firstName} ${employee.lastName}`}
                                    />
                                </span>,
                            ]}
                        />
                    ))}
            </tbody>
        </table>
    );
};

export default EmployeeTable; 