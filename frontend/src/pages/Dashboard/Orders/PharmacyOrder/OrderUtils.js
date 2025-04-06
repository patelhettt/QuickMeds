import { toast } from 'react-toastify';

// Format date for display
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Process and enrich orders with user details
export const enrichOrdersWithUserDetails = async (orders) => {
    // Create a map of user IDs to look up
    const userIds = new Set();
    orders.forEach(order => {
        if (order.requestedBy && !order.email && !order.store_name) {
            // If requestedBy looks like a MongoDB ID and we don't have email/store_name
            if (order.requestedBy.match(/^[0-9a-fA-F]{24}$/)) {
                userIds.add(order.requestedBy);
            }
        }
    });

    if (userIds.size === 0) {
        return orders; // No enrichment needed
    }

    // Fetch user details for these IDs
    try {
        const userDetailsPromises = Array.from(userIds).map(userId => 
            fetch(`http://localhost:5000/api/products/auth/user/${userId}`)
                .then(res => res.ok ? res.json() : null)
        );
        
        const userDetails = await Promise.all(userDetailsPromises);
        
        // Create a map of user details by ID
        const userMap = {};
        userDetails.forEach(user => {
            if (user && user._id) {
                userMap[user._id] = user;
            }
        });
        
        // Enrich orders with user details
        return orders.map(order => {
            if (order.requestedBy && userMap[order.requestedBy]) {
                const user = userMap[order.requestedBy];
                return {
                    ...order,
                    email: user.email || order.email,
                    store_name: user.store_name || order.store_name,
                    // Keep the original requestedBy but add a display name
                    requestedByName: `${user.firstName} ${user.lastName}`
                };
            }
            return order;
        });
    } catch (error) {
        console.error("Error enriching orders with user details:", error);
        return orders; // Return original orders on error
    }
};

// Handle order approval
export const handleApproveOrder = async (orderId, userRole, setIsLoading) => {
    // Only allow superadmin to approve orders
    if (userRole !== 'superadmin') {
        toast.error('Only superadmins can approve orders');
        return false;
    }

    setIsLoading(true);
    
    try {
        const response = await fetch(`http://localhost:5000/api/orders/pharmacy/${orderId}/approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                approvedBy: userRole
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            toast.success(data.message || 'Order approved successfully');
            return true;
        } else {
            toast.error(data.message || 'Failed to approve order');
            return false;
        }
    } catch (err) {
        toast.error(`An error occurred: ${err.message}`);
        console.error(err);
        return false;
    } finally {
        setIsLoading(false);
    }
};

// Handle order rejection
export const handleRejectOrder = async (orderId, userRole) => {
    // Only allow superadmin to reject orders
    if (userRole !== 'superadmin') {
        toast.error('Only superadmins can reject orders');
        return false;
    }
    
    // Ask for rejection reason
    const rejectionReason = prompt('Please provide a reason for rejection:');
    
    if (rejectionReason === null) {
        // User cancelled the prompt
        return false;
    }
    
    try {
        const response = await fetch(`http://localhost:5000/api/orders/pharmacy/${orderId}/reject`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rejectedBy: userRole,
                rejectionReason: rejectionReason || 'No reason provided'
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            toast.success('Order rejected successfully');
            return true;
        } else {
            toast.error(data.message || 'Failed to reject order');
            return false;
        }
    } catch (err) {
        toast.error(`An error occurred: ${err.message}`);
        console.error(err);
        return false;
    }
}; 