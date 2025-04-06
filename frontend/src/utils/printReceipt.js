const printReceipt = (orderDetails) => {
    const receiptWindow = window.open('', '_blank');
    
    if (receiptWindow) {
        receiptWindow.document.write(`
            <html>
            <head>
                <title>Receipt - Order #${orderDetails.order_id}</title>
                <style>
                    @media print {
                        @page { margin: 0; }
                        body { margin: 1cm; }
                    }
                    body {
                        font-family: 'Helvetica', 'Arial', sans-serif;
                        max-width: 300px;
                        margin: 0 auto;
                        padding: 10px;
                        color: #333;
                        line-height: 1.4;
                    }
                    .receipt {
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 15px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        background: #fff;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 15px;
                        padding-bottom: 15px;
                        border-bottom: 2px dashed #eee;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 5px;
                        color: #05cbbf;
                    }
                    .store-info {
                        font-size: 12px;
                        color: #666;
                        margin-bottom: 10px;
                    }
                    .receipt-title {
                        font-size: 16px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        margin: 10px 0;
                    }
                    .order-info {
                        display: flex;
                        justify-content: space-between;
                        font-size: 12px;
                        margin-bottom: 15px;
                    }
                    .divider {
                        border-bottom: 1px dashed #eee;
                        margin: 10px 0;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 15px 0;
                    }
                    .items-table th {
                        text-align: left;
                        font-size: 12px;
                        padding: 5px 0;
                        border-bottom: 1px solid #ddd;
                        color: #666;
                    }
                    .items-table td {
                        padding: 8px 0;
                        font-size: 12px;
                        border-bottom: 1px dotted #eee;
                    }
                    .item-name {
                        max-width: 150px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .qty {
                        text-align: center;
                    }
                    .price, .subtotal {
                        text-align: right;
                    }
                    .summary {
                        margin-top: 15px;
                        font-size: 12px;
                    }
                    .subtotal-row, .discount-row {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 5px;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        font-weight: bold;
                        font-size: 14px;
                        margin-top: 10px;
                        padding-top: 10px;
                        border-top: 2px solid #333;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        font-size: 11px;
                        color: #777;
                    }
                    .barcode {
                        text-align: center;
                        margin: 15px 0;
                        font-family: 'Courier New', monospace;
                        font-size: 14px;
                        letter-spacing: 2px;
                    }
                    .thank-you {
                        text-align: center;
                        font-size: 14px;
                        margin: 15px 0 5px;
                    }
                    .policies {
                        font-size: 10px;
                        color: #999;
                        text-align: center;
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <div class="header">
                        <div class="logo">QuickMeds</div>
                        <div class="store-info">
                            - Distributor -<br>
                            Phone: 74859 06699<br>
                            Email: info@quickmeds.com
                        </div>
                        <div class="receipt-title">Sales Receipt</div>
                    </div>
                    
                    <div class="order-info">
                        <div>
                            <strong>Order #:</strong> ${orderDetails.order_id}<br>
                            <strong>Customer:</strong> ${orderDetails.customer.name}
                            ${orderDetails.customer.phone ? `<br><strong>Phone:</strong> ${orderDetails.customer.phone}` : ''}
                        </div>
                        <div>
                            <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
                            <strong>Time:</strong> ${new Date().toLocaleTimeString()}<br>
                            <strong>Payment:</strong> ${orderDetails.payment.method.toUpperCase()}
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th class="qty">Qty</th>
                                <th class="price">Price</th>
                                <th class="subtotal">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderDetails.products.map(item => `
                                <tr>
                                    <td class="item-name">${item.product_name}</td>
                                    <td class="qty">${item.quantity}</td>
                                    <td class="price">$${item.price.toFixed(2)}</td>
                                    <td class="subtotal">$${item.subtotal.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="summary">
                        <div class="subtotal-row">
                            <span>Subtotal</span>
                            <span>$${orderDetails.payment.subtotal.toFixed(2)}</span>
                        </div>
                        
                        ${orderDetails.payment.discount > 0 ? `
                        <div class="discount-row">
                            <span>Discount</span>
                            <span>-$${orderDetails.payment.discount.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        
                        <div class="total-row">
                            <span>TOTAL</span>
                            <span>$${orderDetails.payment.total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="barcode">
                        *${orderDetails.order_id}*
                    </div>
                    
                    <div class="thank-you">Thank you for your purchase!</div>
                    
                    <div class="policies">
                        Return policy: Items may be returned within 7 days with receipt.<br>
                        Prescription medications cannot be returned once dispensed.
                    </div>
                    
                    <div class="footer">
                        Powered by QuickMeds System<br>
                        ${new Date().toISOString().split('T')[0]}
                    </div>
                </div>
            </body>
            </html>
        `);
        
        receiptWindow.document.close();
        receiptWindow.print();
        
        return true;
    } else {
        return false;
    }
};

export default printReceipt; 