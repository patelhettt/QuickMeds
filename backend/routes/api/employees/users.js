const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection setup
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

client.connect().then(() => console.log("✅ Connected to MongoDB")).catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
});

// Collection reference
const userCollection = client.db('products').collection('users');

// Middleware to check user role
const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(401).json({ message: 'No token provided' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userCollection.findOne({ _id: new ObjectId(decoded.id) });

            if (!user) return res.status(403).json({ message: 'User not found' });

            if (user.role === 'superadmin' || (requiredRole === 'admin' && user.role === 'admin')) {
                req.userId = decoded.id;
                req.userRole = user.role;
                next();
            } else {
                return res.status(403).json({ message: 'Unauthorized' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

// GET all employees
router.get('/', async (req, res) => {
    try {
        const employees = await userCollection.find().toArray();
        if (!employees.length) return res.status(404).json({ message: "No employees found" });

        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET an employee by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid employee ID" });

        const employee = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!employee) return res.status(404).json({ message: `Employee with ID ${id} not found` });

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Register a new employee
router.post('/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, role = 'employee' } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await userCollection.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userCollection.insertOne({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: "Employee added successfully", userId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE an employee by ID
router.delete('/:id', checkRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid employee ID" });

        const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
        if (!result.deletedCount) return res.status(404).json({ message: `Employee with ID ${id} not found` });

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// PUT update an employee by ID - Modified to handle all fields
// Update the employee update endpoint
// PUT update employee
// Fix the update endpoint to use userCollection instead of User model
router.put('/:id', checkRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        // Use userCollection instead of User model
        const result = await userCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (!result.matchedCount) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Fetch updated user to return
        const updatedUser = await userCollection.findOne(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        );

        res.json({
            message: "Employee updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            message: error.message || "Server error"
        });
    }
});

// PUT update an employee role by ID
router.put('/:id/role', checkRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid employee ID" });

        if (req.userId === id) return res.status(403).json({ message: 'Cannot modify your own role' });

        if (req.userRole === 'admin' && role === 'superadmin') {
            return res.status(403).json({ message: 'Admin cannot set SuperAdmin role' });
        }

        const result = await userCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { role } }
        );

        if (!result.matchedCount) return res.status(404).json({ message: `Employee with ID ${id} not found` });

        res.status(200).json({ message: "Role updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
