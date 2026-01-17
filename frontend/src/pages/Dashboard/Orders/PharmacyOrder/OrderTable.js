import React, { useState } from 'react';
import PrintButton2 from '../../../../components/buttons/PrintButton2';
import { showToast, TOAST_IDS } from './OrderUtils';

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
    // State for partial approval quantities
    const [approvedQuantities, setApprovedQuantities] = useState({});
    const [partialApprovalNote, setPartialApprovalNote] = useState('');

    // Helper function to handle quantity change
    const handleQuantityChange = (orderId, itemId, quantity) => {
        setApprovedQuantities(prev => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [itemId]: parseInt(quantity) || 0
            }
        }));
    };

    // Helper function to handle approval with confirmation
    const onApprove = (e, orderId, items) => {
        e.stopPropagation();
        
        const orderQuantities = approvedQuantities[orderId] || {};
        const isPartialApproval = Object.keys(orderQuantities).length > 0;
        
        const message = isPartialApproval 
            ? 'Are you sure you want to partially approve this order with the specified quantities?' 
            : 'Are you sure you want to fully approve this order?';

        if (window.confirm(message)) {
            handleApproveOrder(orderId, isPartialApproval ? {
                approvedQuantities: orderQuantities,
                note: partialApprovalNote || 'Partial quantities approved'
            } : null);
        }
    };
    
    // Helper function to handle rejection
    const onReject = (e, orderId) => {
        e.stopPropagation();
        handleRejectOrder(orderId);
    };

    return (
        <div className="overflow-x-auto">
            {pharmacyOrders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No orders found</p>
                    {userRole === 'admin' && (
                        <p className="text-gray-400 text-sm mt-2">
                            You'll see orders for your store here once they're created
                        </p>
                    )}
                </div>
            ) : (
                <table className="table table-zebra table-compact w-full">
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
                                                                    onClick={(e) => onApprove(e, order._id, order.items)}
                                                                    disabled={isLoading}
                                                                    className="btn btn-xs btn-success text-black">
                                                                    {isLoading ? 'Processing...' : 'Approve'}
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => onReject(e, order._id)}
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
                                                    <div className="overflow-x-auto">
                                                        <table className="table table-compact w-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>Item Name</th>
                                                                    <th>Category</th>
                                                                    <th>Strength</th>
                                                                    <th>Requested Quantity</th>
                                                                    {order.status === 'pending' && userRole === 'superadmin' && (
                                                                        <th>Approve Quantity</th>
                                                                    )}
                                                                    {order.status === 'approved' && (
                                                                        <th>Approved Quantity</th>
                                                                    )}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {order.items.map((item, idx) => (
                                                                    <tr key={idx}>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.category}</td>
                                                                        <td>{item.strength}</td>
                                                                        <td>{item.quantity}</td>
                                                                        {order.status === 'pending' && userRole === 'superadmin' && (
                                                                            <td>
                                                                                <input
                                                                                    type="number"
                                                                                    className="input input-bordered input-sm w-24"
                                                                                    min="0"
                                                                                    max={item.quantity}
                                                                                    placeholder={item.quantity}
                                                                                    onChange={(e) => handleQuantityChange(
                                                                                        order._id,
                                                                                        item.itemId,
                                                                                        e.target.value
                                                                                    )}
                                                                                />
                                                                            </td>
                                                                        )}
                                                                        {order.status === 'approved' && (
                                                                            <td>{item.approvedQuantity || item.quantity}</td>
                                                                        )}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    
                                                    {order.status === 'pending' && userRole === 'superadmin' && (
                                                        <div className="mt-4">
                                                            <textarea
                                                                className="textarea textarea-bordered w-full"
                                                                placeholder="Add a note for partial approval (optional)"
                                                                value={partialApprovalNote}
                                                                onChange={(e) => setPartialApprovalNote(e.target.value)}
                                                            />
                                                            <div className="mt-4 flex justify-end gap-2">
                                                                <button 
                                                                    onClick={() => onApprove({ stopPropagation: () => {} }, order._id, order.items)}
                                                                    className="btn btn-sm btn-success text-black">
                                                                    {Object.keys(approvedQuantities[order._id] || {}).length > 0 
                                                                        ? 'Partially Approve Order' 
                                                                        : 'Approve Order'
                                                                    }
                                                                </button>
                                                                <button 
                                                                    onClick={() => onReject({ stopPropagation: () => {} }, order._id)}
                                                                    className="btn btn-sm btn-error text-black">
                                                                    Reject Order
                                                                </button>
                                                            </div>
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
            )}
        </div>
    );
};

export default OrderTable; 