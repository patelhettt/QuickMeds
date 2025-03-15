const express = require('express');
const mongoose = require('mongoose');
const User = require('../api/models/User'); // Assuming you have a User model defined

const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

// Middleware to get user by ID
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;