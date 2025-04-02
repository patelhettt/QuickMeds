const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../api/models/User");
const router = express.Router();


// @route   POST /api/auth/register
// @desc    Register a new user
// Update the registration endpoint to match User model
router.post("/register", async (req, res) => {
    try {
        // Receive firstName and lastName directly from request
        const { firstName, lastName, email, password, confirmPassword, phone, city, store_name, role } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Remove name splitting logic
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Keep existing email validation
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with all fields
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            city,
            store_name,
            role: role || 'employee'
        });

        await newUser.save();
        res.status(201).json({ 
            message: "User registered successfully",
            userId: newUser._id
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Get single user by ID
// Change the route path to match the frontend request
// Update the user retrieval logic


// Add this at the bottom if missing
module.exports = router;