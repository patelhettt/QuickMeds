import React from 'react';
import PrintButton2 from '../../../../components/buttons/PrintButton2';

const OrderTable = ({ 
    pharmacyOrders, 
    tableHead, 
    expandedOrderId, 
    toggleExpandRow, 
    formatDate, 
    handleApproveOrder, 
    handleRejectOrder, 
    userRole, 
    isLoading 
}) => {
    return (
        <table className="table table-zebra table-compact">
            <thead>
                {tableHead}
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
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {order.requestedByName || order.requestedBy || 'Unknown'}
                                        </span>
                                        {order.email ? (
                                            <span className="text-xs text-gray-500">
                                                {order.email}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-500 italic">
                                                No email provided
                                            </span>
                                        )}
                                        {order.store_name ? (
                                            <span className="text-xs text-gray-500">
                                                {order.store_name}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-500 italic">
                                                No store name provided
                                            </span>
                                        )}
                                    </div>
                                </td>
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
                                                {userRole === 'superadmin' && (
                                                    <>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleApproveOrder(order._id);
                                                            }}
                                                            disabled={isLoading}
                                                            className="btn btn-xs btn-success text-black">
                                                            {isLoading ? 'Processing...' : 'Approve'}
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRejectOrder(order._id);
                                                            }}
                                                            className="btn btn-xs btn-error text-black">
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {userRole === 'admin' && (
                                                    <span className="text-xs text-gray-500 italic">
                                                        Waiting for approval
                                                    </span>
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
                                                    {userRole === 'superadmin' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleApproveOrder(order._id)}
                                                                className="btn btn-sm btn-success text-black">
                                                                Approve Order
                                                            </button>
                                                            <button 
                                                                onClick={() => handleRejectOrder(order._id)}
                                                                className="btn btn-sm btn-error text-black">
                                                                Reject Order
                                                            </button>
                                                        </>
                                                    )}
                                                    {userRole === 'admin' && (
                                                        <div className="text-gray-500 italic">
                                                            Only superadmins can approve or reject orders
                                                        </div>
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
    );
};

export default OrderTable; 