const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Load environment variables
require('dotenv').config();

// MongoDB connection URI
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); // Terminate the process if the connection fails
    }
}

connectToDatabase();

// Database collection
const customersCollection = client.db('products').collection('customers');

// GET all customers
router.get('/', async (req, res) => {
    try {
        const query = {};
        const cursor = customersCollection.find(query);
        const customers = await cursor.toArray();

        const count = await customersCollection.countDocuments(query);

        if (count === 0) {
            return res.status(404).json({ message: "No customers found" });
        }

        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET a customer by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid customer ID" });
        }

        const query = { _id: new ObjectId(id) };
        const customer = await customersCollection.findOne(query);

        if (!customer) {
            return res.status(404).json({ message: `Customer with ID ${id} not found` });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("Error fetching customer:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// POST a new customer
router.post('/', async (req, res) => {
    try {
        const newCustomer = req.body;

        if (!validateCustomer(newCustomer)) {
            return res.status(400).json({ message: "Invalid customer data" });
        }

        const result = await customersCollection.insertOne(newCustomer);
        res.status(201).json({ message: "Customer added successfully", data: result });
    } catch (error) {
        console.error("Error adding customer:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// DELETE a customer by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid customer ID" });
        }

        const query = { _id: new ObjectId(id) };
        const result = await customersCollection.deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Customer with ID ${id} not found` });
        }

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Error deleting customer:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT update a customer by ID
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid customer ID" });
        }

        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };

        const updateCustomerData = {
            $set: {
                name: updateData.name,
                phone: updateData.phone,
                email: updateData.email,
                address: updateData.address,
                updatedBy: updateData.updatedBy,
                updatedTime: new Date()
            }
        };

        const result = await customersCollection.updateOne(filter, updateCustomerData, options);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: `Customer with ID ${id} not found` });
        }

        res.status(200).json({ message: "Customer updated successfully", result });
    } catch (error) {
        console.error("Error updating customer:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Helper function to validate customer data
function validateCustomer(customer) {
    const requiredFields = ['name', 'phone', 'email', 'address'];
    for (const field of requiredFields) {
        if (!customer[field]) {
            return false;
        }
    }
    return true;
}

module.exports = router;