const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Registration Route
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, phone, city, store_name, role } = req.body;

        console.log(role);
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            phone,
            city,
            store_name,
            role
        });
        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "18h" });

        res.status(201).json({ message: "User registered successfully", token });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token, user });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Add authentication middleware to protect this route
router.get('/user/:id', async (req, res) => {  // <- This line is correct
    try {
        const { id } = req.params;

        // Validate ID format first
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Use Mongoose model instead of direct collection
        const user = await User.findById(id).select('-password -__v');

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        console.error("User fetch error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Update Employee Route
router.put('/employees/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, city, store_name, role } = req.body;
        const employeeId = req.params.id;

        // Find employee by ID
        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update employee details
        employee.firstName = firstName || employee.firstName;
        employee.lastName = lastName || employee.lastName;
        employee.email = email || employee.email;
        employee.phone = phone || employee.phone;
        employee.city = city || employee.city;
        employee.store_name = store_name || employee.store_name;
        employee.role = role || employee.role;

        // Save updated employee
        const updatedEmployee = await employee.save();

        res.json({
            message: 'Employee updated successfully',
            employee: updatedEmployee
        });

    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({ message: 'Server error during employee update' });
    }
});



module.exports = router;
