const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in memory
const otpStore = {};

// Validate password strength
const validatePassword = (password) => {
    // Password should be at least 8 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

// Registration Route with enhanced validation
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, phone, city, store_name, role } = req.body;

        // Get requester information from token
        const token = req.headers.authorization?.replace('Bearer ', '');
        let requesterRole = 'guest';
        let requesterCity = '';
        let requesterStore = '';

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const requester = await User.findById(decoded.id);
                if (requester) {
                    requesterRole = requester.role;
                    requesterCity = requester.city;
                    requesterStore = requester.store_name;
                }
            } catch (error) {
                console.error("Token verification error:", error);
            }
        }

        // Basic validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !city || !store_name || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Name validation - only alphabets allowed
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(firstName)) {
            return res.status(400).json({ message: "First name should contain only alphabets" });
        }
        if (!nameRegex.test(lastName)) {
            return res.status(400).json({ message: "Last name should contain only alphabets" });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Phone validation - exactly 10 digits
        const phoneDigits = phone.replace(/[-()\s]/g, '');
        if (!/^\d{10}$/.test(phoneDigits)) {
            return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
        }

        // Password validation - 8 chars, uppercase, lowercase, number, special char
        if (!validatePassword(password)) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Admin can only add employees to their store/city
        if (requesterRole === 'admin') {
            if (city !== requesterCity) {
                return res.status(403).json({ message: "Admin can only add employees to their own city" });
            }
            if (store_name !== requesterStore) {
                return res.status(403).json({ message: "Admin can only add employees to their own store" });
            }
            // Admin can only create employee accounts
            if (role !== 'employee') {
                return res.status(403).json({ message: "Admin can only create employee accounts" });
            }
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
        const newToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "18h" });

        res.status(201).json({ 
            message: "User registered successfully", 
            token: newToken,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        });

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

// Update Employee Route with enhanced validation
router.put('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Employee ID' });
        }

        const { firstName, lastName, email, phone, city, store_name, role } = req.body;
        
        // Get requester information from token
        const token = req.headers.authorization?.replace('Bearer ', '');
        let requesterRole = 'guest';
        let requesterCity = '';
        let requesterStore = '';

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const requester = await User.findById(decoded.id);
                if (requester) {
                    requesterRole = requester.role;
                    requesterCity = requester.city;
                    requesterStore = requester.store_name;
                }
            } catch (error) {
                console.error("Token verification error:", error);
                return res.status(401).json({ message: 'Authentication failed' });
            }
        } else {
            return res.status(401).json({ message: 'Authentication token required' });
        }

        // Validate required fields
        if (!firstName && !lastName && !email && !phone && !city && !store_name && !role) {
            return res.status(400).json({ message: 'At least one field is required for update' });
        }

        // Name validation - only alphabets allowed
        const nameRegex = /^[A-Za-z\s]+$/;
        if (firstName && !nameRegex.test(firstName)) {
            return res.status(400).json({ message: "First name should contain only alphabets" });
        }
        if (lastName && !nameRegex.test(lastName)) {
            return res.status(400).json({ message: "Last name should contain only alphabets" });
        }

        // Email validation
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
        }

        // Phone validation - exactly 10 digits
        if (phone) {
            const phoneDigits = phone.replace(/[-()\s]/g, '');
            if (!/^\d{10}$/.test(phoneDigits)) {
                return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
            }
        }

        // Get the employee being updated
        const employeeToUpdate = await User.findById(id);
        if (!employeeToUpdate) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Admin can only update employees in their store
        if (requesterRole === 'admin') {
            if (employeeToUpdate.city !== requesterCity || employeeToUpdate.store_name !== requesterStore) {
                return res.status(403).json({ message: "Admin can only update employees from their own store" });
            }
            
            // Admin cannot update other admins
            if (employeeToUpdate.role === 'admin') {
                return res.status(403).json({ message: "Admin cannot update other admin accounts" });
            }
            
            // Admin cannot change an employee's role to admin
            if (role && role !== 'employee') {
                return res.status(403).json({ message: "Admin can only maintain employee role" });
            }
            
            // Admin cannot change employee's city or store
            if ((city && city !== requesterCity) || (store_name && store_name !== requesterStore)) {
                return res.status(403).json({ message: "Admin cannot assign employees to a different city or store" });
            }
        }

        // Check if the email is already taken
        if (email && email !== employeeToUpdate.email) {
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

// OTP Routes
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP in memory with expiry time (10 minutes)
        otpStore[email] = {
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        };

        // Send email with OTP only
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Check if OTP exists and is valid
        if (!otpStore[email] || otpStore[email].otp !== otp || otpStore[email].expiresAt < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Delete the OTP after use
        delete otpStore[email];
        
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
});

// Password Routes
router.post('/forgot-password', async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP in memory with expiry time (10 minutes)
        otpStore[email] = {
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        };

        // Send email with OTP only
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `Your OTP for password reset is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset OTP sent successfully' });
    } catch(error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ message: 'Error processing forgot password request' });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

router.post('/change-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
});

module.exports = router;
