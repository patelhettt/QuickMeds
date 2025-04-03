const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/User");

// Utility function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Define the schema for pharmacy requests
const pharmacyRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    storeName: { type: String, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        productName: { type: String, required: true },
        genericName: { type: String },
        category: { type: String },
        company: { type: String },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number },
        totalPrice: { type: Number }
    }],
    totalItems: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    requestDate: { type: Date, default: Date.now },
    note: { type: String },
    isActive: { type: Boolean, default: true }
});

const PharmacyRequest = mongoose.model('PharmacyRequest', pharmacyRequestSchema);

// Create new request items from cart
router.post('/create-request', async (req, res) => {
    try {
        console.log("Received request data:", req.body);
        
        const { items, userId, storeName, note } = req.body;

        // Validate request body
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Items array is required" 
            });
        }

        if (!userId || !isValidObjectId(userId)) {
            return res.status(400).json({ 
                success: false,
                message: "Valid User ID is required" 
            });
        }

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Create request document
        const requestData = {
            userId: new mongoose.Types.ObjectId(userId),
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email,
            storeName: storeName || user.store_name || "Default Store",
            items: [],
            totalItems: 0,
            status: "Pending",
            requestDate: new Date(),
            note: note || '',
            isActive: true
        };

        // Process each item
        for (const item of items) {
            try {
                if (!isValidObjectId(item.itemId)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid product ID format: ${item.itemId}`
                    });
                }

                const pharmacy = await mongoose.connection.collection('pharmacy').findOne(
                    { _id: new mongoose.Types.ObjectId(item.itemId) }
                );

                if (!pharmacy) {
                    return res.status(404).json({
                        success: false,
                        message: `Product not found for ID: ${item.itemId}`
                    });
                }

                // Validate quantity
                if (item.quantity > pharmacy.stock) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient stock for ${pharmacy.tradeName}. Available: ${pharmacy.stock}`
                    });
                }

                requestData.items.push({
                    productId: new mongoose.Types.ObjectId(pharmacy._id),
                    productName: pharmacy.tradeName,
                    genericName: pharmacy.genericName,
                    category: pharmacy.category,
                    company: pharmacy.company,
                    quantity: parseInt(item.quantity),
                    unitPrice: pharmacy.unitMrp,
                    totalPrice: pharmacy.unitMrp * item.quantity
                });

                requestData.totalItems += parseInt(item.quantity);
            } catch (error) {
                console.error(`Error processing item ${item.itemId}:`, error);
                return res.status(400).json({
                    success: false,
                    message: `Error processing item ${item.name || item.itemId}`
                });
            }
        }

        // Create and save the request using Mongoose model
        const pharmacyRequest = new PharmacyRequest(requestData);
        const savedRequest = await pharmacyRequest.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: "Request created successfully",
            requestId: savedRequest._id,
            data: savedRequest
        });

    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create request",
            error: error.message
        });
    }
});

// Get all requests for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        const requests = await PharmacyRequest.find({ userId: new mongoose.Types.ObjectId(userId) })
            .sort({ requestDate: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user requests",
            error: error.message
        });
    }
});

// Get request details by ID
router.get('/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;

        if (!isValidObjectId(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format"
            });
        }

        const request = await PharmacyRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch request details",
            error: error.message
        });
    }
});

// Update request status
router.patch('/:requestId/status', async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!isValidObjectId(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format"
            });
        }

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const request = await PharmacyRequest.findByIdAndUpdate(
            requestId,
            { $set: { status } },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({
            message: "Request status updated successfully",
            request
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update request status",
            error: error.message
        });
    }
});

// Delete a request
router.delete('/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;

        if (!isValidObjectId(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format"
            });
        }

        const request = await PharmacyRequest.findByIdAndDelete(requestId);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({
            message: "Request deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete request",
            error: error.message
        });
    }
});

module.exports = router;