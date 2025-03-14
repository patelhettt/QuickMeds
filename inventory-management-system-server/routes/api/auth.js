const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../api/models/User");
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, userType } = req.body;

        // Validate required fields
        if (!name || !email || !password || !userType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Split the name into firstName and lastName
        const [firstName, lastName] = name.split(' ');
        if (!firstName || !lastName) {
            return res.status(400).json({ message: "Please provide both first and last names" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists" });
        }

        // Hash the password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            userType
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;