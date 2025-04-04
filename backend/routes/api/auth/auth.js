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
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Employee ID' });
        }

        const { firstName, lastName, email, phone, city, store_name, role } = req.body;
        console.log(req.body);
        // Validate required fields if necessary
        if (!firstName && !lastName && !email && !phone && !city && !store_name && !role) {
            return res.status(400).json({ message: 'At least one field is required for update' });
        }

        // Check if the email is already taken
        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: id } });
            if (emailExists) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
        }

        // Update Employee in one query
        const updatedEmployee = await User.findByIdAndUpdate(
            id,
            { $set: { firstName, lastName, email, phone, city, store_name, role } },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully', employee: updatedEmployee });

    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({ message: 'Server error during employee update' });
    }
});

// Add this route to get the current user
router.get('/user', async (req, res) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
