import React from 'react';

// Main orders table header items
export const tableHeadItems = [
    'SN', 
    'Order ID', 
    'Requested By', 
    'Status', 
    'Items Count', 
    'Requested At', 
    'Note', 
    'Actions'
];

// Table header for modal table 1
export const modalTableHeadItems1 = [
    'SN', 
    'Name', 
    'Strength', 
    'Company', 
    'Category', 
    'Pack Type', 
    'TP'
];

// Table header for modal table 2
export const modalTableHeadItems2 = [
    'SN', 
    'Name', 
    'Strength', 
    'Category', 
    'Stock', 
    'Quantity', 
    'Total TP', 
    'Action'
];

// Creates the table head component from header items
export const createTableHead = (headerItems) => (
    <tr>
        {
            headerItems?.map((headerItem, index) => (
                <th key={index} className='text-xs md:text-2xs lg:text-md'>{headerItem}</th>
            ))
        }
    </tr>
);

// Pre-created table headers for direct use
const OrderTableHeaders = {
    tableHead: createTableHead(tableHeadItems),
    modalTableHead1: createTableHead(modalTableHeadItems1),
    modalTableHead2: createTableHead(modalTableHeadItems2)
};

export default OrderTableHeaders; 