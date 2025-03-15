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
const employeesCollection = client.db('products').collection('employees');

// GET all employees
router.get('/', async (req, res) => {
    try {
        console.log("Fetching employees from the database...");
        const query = {};
        const cursor = employeesCollection.find(query);
        const employees = await cursor.toArray();

        // Correct usage of countDocuments
        const count = await employeesCollection.countDocuments(query);

        if (count === 0) {
            return res.status(404).json({ message: "No employees found" });
        }

        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET an employee by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        const query = { _id: new ObjectId(id) };
        const employee = await employeesCollection.findOne(query);

        if (!employee) {
            return res.status(404).json({ message: `Employee with ID ${id} not found` });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST a new employee
router.post('/', async (req, res) => {
    try {
        const newEmployee = req.body;

        if (!validateEmployee(newEmployee)) {
            return res.status(400).json({ message: "Invalid employee data" });
        }

        const result = await employeesCollection.insertOne(newEmployee);
        res.status(201).json({ message: "Employee added successfully", data: result });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE an employee by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        const query = { _id: new ObjectId(id) };
        const result = await employeesCollection.deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Employee with ID ${id} not found` });
        }

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT update an employee by ID
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };

        const updateEmployeeData = {
            $set: {
                name: updateData.name,
                phone: updateData.phone,
                website: updateData.website,
                email: updateData.email,
                address: updateData.address,
                updatedBy: updateData.updatedBy,
                updatedTime: new Date()
            }
        };

        const result = await employeesCollection.updateOne(filter, updateEmployeeData, options);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: `Employee with ID ${id} not found` });
        }

        res.status(200).json({ message: "Employee updated successfully", result });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Helper function to validate employee data
function validateEmployee(employee) {
    const requiredFields = ['name', 'phone', 'website', 'email', 'address'];
    for (const field of requiredFields) {
        if (!employee[field]) {
            return false;
        }
    }
    return true;
}

module.exports = router;