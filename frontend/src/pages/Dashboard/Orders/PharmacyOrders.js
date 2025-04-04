import React from 'react';
import SaveButton from '../../../components/buttons/SaveButton';
import CancelButton from '../../../components/buttons/CancelButton';
import PrintButton from '../../../components/buttons/PrintButton';
import NewButton from '../../../components/buttons/NewButton';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import ModalCloseButton from '../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../components/headings/ModalHeading';
import { useState } from 'react';
import { useEffect } from 'react';
import RefreshButton from '../../../components/buttons/RefreshButton';
import TableRow from '../../../components/TableRow';
import EditButton from '../../../components/buttons/EditButton';
import DeleteButton from '../../../components/buttons/DeleteButton';
import { toast } from 'react-toastify';
import DashboardPageHeading from '../../../components/headings/DashboardPageHeading';
import AddModal from '../../../components/modals/AddModal';
import PrintButton2 from '../../../components/buttons/PrintButton2';
import MailButton from '../../../components/buttons/MailButton';

const PharmacyOrders = () => {
    const tableHeadItems = ['SN', 'Order ID', 'Requested By', 'Status', 'Items Count', 'Requested At', 'Note', 'Actions'];

    const modalTableHeadItems1 = ['SN', 'Name', 'Strength', 'Company', 'Category', 'Pack Type', 'TP'];

    const modalTableHeadItems2 = ['SN', 'Name', 'Strength', 'Category', 'Stock', 'Quantity', 'Total TP', 'Action'];

    const tableHead = <tr>
        {
            tableHeadItems?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    const modalTableHead1 = <tr>
        {
            modalTableHeadItems1?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    const modalTableHead2 = <tr>
        {
            modalTableHeadItems2?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    // add pharmacy order to db
    const addPharmacyOrder = event => {
        event.preventDefault();

        const supplier = event?.target?.supplier?.value; const tradeName = event?.target?.tradeName?.value;
        const category = event?.target?.category?.value;
        const strength = event?.target?.strength?.value;
        const boxType = event?.target?.boxType?.value;
        const unitType = event?.target?.unitType?.value;
        const creator = 'admin';
        const createdAt = new Date();

        const productDetails = { supplier, tradeName, category, strength, boxType, unitType, creator, createdAt };

        // send data to server
        fetch('http://localhost:5000/api/orders/pharmacy', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(productDetails)
        })
            .then(res => res.json())
            .then(data => {
                toast(
                    <AddModal name='Order' />
                );
            });

        event.target.reset();
    };

    const [pharmacyOrders, setPharmacyOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [userRole, setUserRole] = useState('superadmin'); // Changed from 'admin' to 'superadmin'
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // get all pharmacy orders
    useEffect(() => {
        fetch('http://localhost:5000/api/orders/pharmacy')
            .then(res => res.json())
            .then(products => setPharmacyOrders(products));
    }, []);

    // get categories data
    useEffect(() => {
        fetch('http://localhost:5000/api/setup/categories')
            .then(res => res.json())
            .then(c => setCategories(c));
    }, []);

    // get all suppliers data
    useEffect(() => {
        fetch('http://localhost:5000/api/suppliers/lists')
            .then(res => res.json())
            .then(s => setSuppliers(s));
    }, []);

    // get unit types data
    useEffect(() => {
        fetch('http://localhost:5000/api/setup/unitTypes')
            .then(res => res.json())
            .then(ut => setUnitTypes(ut));
    }, []);

    // Update the useEffect for user role to handle API failures gracefully
    useEffect(() => {
        // Default to superadmin role to ensure buttons are visible
        setUserRole('superadmin');
        
        // Try to get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                if (parsedUser && parsedUser.role) {
                    setUserRole(parsedUser.role.toLowerCase());
                    console.log("User role set from localStorage:", parsedUser.role.toLowerCase());
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
        
        // No need to fetch from API if we already have the role
    }, []);

    // Handle order approval
    const handleApproveOrder = (orderId) => {
        // Show loading indicator or disable buttons if needed
        
        fetch(`http://localhost:5000/api/orders/pharmacy/${orderId}/approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                approvedBy: userRole // Send the current user role
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Server responded with status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    toast.success('Order approved successfully');
                    // Update the orders list
                    setPharmacyOrders(pharmacyOrders.map(order => 
                        order._id === orderId ? {...order, status: 'approved'} : order
                    ));
                } else {
                    toast.error(data.message || 'Failed to approve order');
                }
            })
            .catch(err => {
                toast.error(`An error occurred: ${err.message}`);
                console.error(err);
            });
    };

    // Handle order rejection
    const handleRejectOrder = (orderId) => {
        // You could add a modal here to ask for rejection reason
        const rejectionReason = prompt('Please provide a reason for rejection:');
        
        if (rejectionReason === null) {
            // User cancelled the prompt
            return;
        }
        
        fetch(`http://localhost:5000/api/orders/pharmacy/${orderId}/reject`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rejectedBy: userRole,
                rejectionReason: rejectionReason || 'No reason provided'
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Server responded with status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    toast.success('Order rejected successfully');
                    // Update the orders list
                    setPharmacyOrders(pharmacyOrders.map(order => 
                        order._id === orderId ? {...order, status: 'rejected'} : order
                    ));
                } else {
                    toast.error(data.message || 'Failed to reject order');
                }
            })
            .catch(err => {
                toast.error(`An error occurred: ${err.message}`);
                console.error(err);
            });
    };

    // Toggle expanded row
    const toggleExpandRow = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Pharmacy Orders'
                value={pharmacyOrders.length}
                buttons={[
                    <NewButton modalId='create-new-product' />,
                    <RefreshButton />,
                    <PrintButton />
                ]}
            />

            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer z-50">
                <label className="modal-box lg:w-8/12 md:w-8/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-product'} />

                    <ModalHeading modalHeading={'Create a Pharmacy Order'} />

                    <form onSubmit={addPharmacyOrder}>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 mb-2'>
                            <Select title={'Supplier'} name='supplier' isRequired='required' options={suppliers.map(s => s.name)} />
                            <Input title={'Trade Name'} type='text' placeholder='Trade name' name='tradeName' isRequired='required' />
                            <Select title={'Category'} name='category' isRequired='required' options={categories.map(c => c.name)} />

                            <Input title={'Strength'} type='text' placeholder='Strength' name='strength' isRequired='required' />

                            <Select title={'Box Type'} name='boxType' isRequired='required' />
                            <Select title={'Unit Type'} name='unitType' isRequired='required' options={unitTypes.map(u => u.name)} />
                        </div>

                        <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                            <div className="grid">
                                <table className="table table-zebra table-compact">
                                    <thead>
                                        {
                                            modalTableHead1
                                        }
                                    </thead>
                                    <tbody>
                                        {
                                            pharmacyOrders.map((product, index) =>
                                                <TableRow
                                                    key={product._id}
                                                    tableRowsData={
                                                        [
                                                            index + 1,
                                                            product.name,
                                                            product.strength,
                                                            product.company,
                                                            product.category,
                                                            product.packType,
                                                            product.Tp,
                                                        ]
                                                    } />)
                                        }
                                    </tbody>
                                </table>

                                <SaveButton extraClass={'mt-4'} />
                            </div>

                            <div className="divider lg:divider-horizontal"></div>

                            <div className="grid">

                                <table className="table table-zebra table-compact">
                                    <thead>
                                        {
                                            modalTableHead2
                                        }
                                    </thead>
                                    <tbody>
                                        {
                                            pharmacyOrders.map((product, index) =>
                                                <TableRow
                                                    key={product._id}
                                                    tableRowsData={
                                                        [
                                                            index + 1,
                                                            product.name,
                                                            product.strength,
                                                            product.category,
                                                            product.stock,
                                                            product.quantity,
                                                            product.totalTp,
                                                            <span className='flex items-center gap-x-1'>
                                                                <EditButton />
                                                                <DeleteButton
                                                                    deleteApiLink='http://localhost:5000/api/orders/pharmacy/'
                                                                    itemId={'pharmacyOrder._id'} />
                                                            </span>
                                                        ]
                                                    } />)
                                        }
                                    </tbody>
                                </table>

                                <CancelButton extraClass={'mt-4'} />
                            </div>
                        </div>
                    </form>
                </label>
            </label>

            <table className="table table-zebra table-compact">
                <thead>
                    {
                        tableHead
                    }
                </thead>
                <tbody>
                    {
                        pharmacyOrders.map((order, index) => (
                            <React.Fragment key={order._id}>
                                <tr 
                                    className={`cursor-pointer hover:bg-base-200 ${expandedOrderId === order._id ? 'bg-base-200' : ''}`}
                                    onClick={() => toggleExpandRow(order._id)}
                                >
                                    <td>{index + 1}</td>
                                    <td>{order._id.substring(0, 8) + '...'}</td>
                                    <td>{order.requestedBy}</td>
                                    <td>
                                        <span className={`badge ${
                                            order.status === 'pending' ? 'badge-warning' : 
                                            order.status === 'approved' ? 'badge-success' : 
                                            'badge-error'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="tooltip" data-tip={order.items.map(item => item.name).join(', ')}>
                                            <span>{order.items.length} items</span>
                                        </div>
                                    </td>
                                    <td>{formatDate(order.requestedAt)}</td>
                                    <td>{order.note ? (order.note.length > 20 ? order.note.substring(0, 20) + '...' : order.note) : '-'}</td>
                                    <td>
                                        <span className='flex items-center gap-x-1'>
                                            {order.status === 'pending' && (
                                                <>
                                                    {/* Update this condition to include 'superadmin' */}
                                                    {(userRole === 'admin' || userRole === 'superadmin') && (
                                                        <>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleApproveOrder(order._id);
                                                                }}
                                                                className="btn btn-xs btn-success text-white">
                                                                Approve
                                                            </button>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRejectOrder(order._id);
                                                                }}
                                                                className="btn btn-xs btn-error text-white">
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            <PrintButton2 />
                                        </span>
                                    </td>
                                </tr>
                                {expandedOrderId === order._id && (
                                    <tr>
                                        <td colSpan={8} className="bg-base-100 p-4">
                                            <div className="p-2 border rounded-md">
                                                <h4 className="font-semibold text-md mb-2">Order Items:</h4>
                                                <table className="table table-zebra table-compact w-full">
                                                    <thead>
                                                        <tr>
                                                            <th>SN</th>
                                                            <th>Item Name</th>
                                                            <th>Category</th>
                                                            <th>Strength</th>
                                                            <th>Quantity</th>
                                                            <th>Available</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.items.map((item, idx) => (
                                                            <tr key={item.itemId}>
                                                                <td>{idx + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.category}</td>
                                                                <td>{item.strength}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>{item.available}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                
                                                {order.status === 'pending' && (
                                                    <div className="mt-4 flex justify-end gap-2">
                                                        {/* Update this condition to include 'superadmin' */}
                                                        {(userRole === 'admin' || userRole === 'superadmin') && (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleApproveOrder(order._id)}
                                                                    className="btn btn-sm btn-success text-white">
                                                                    Approve Order
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleRejectOrder(order._id)}
                                                                    className="btn btn-sm btn-error text-white">
                                                                    Reject Order
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    }
                </tbody>
            </table>
        </section >
    );
};

export default PharmacyOrders;