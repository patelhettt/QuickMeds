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
const categoriesCollection = client.db('setup').collection('categories');

// GET all categories
router.get('/', async (req, res) => {
    try {
        const query = {};
        const cursor = categoriesCollection.find(query);
        const categories = await cursor.toArray();

        const count = await categoriesCollection.countDocuments(query);

        if (count === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET a category by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const query = { _id: new ObjectId(id) };
        const category = await categoriesCollection.findOne(query);

        if (!category) {
            return res.status(404).json({ message: `Category with ID ${id} not found` });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error("Error fetching category:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// POST a new category
router.post('/', async (req, res) => {
    try {
        const newCategory = req.body;

        if (!validateCategory(newCategory)) {
            return res.status(400).json({ message: "Invalid category data" });
        }

        const result = await categoriesCollection.insertOne(newCategory);
        res.status(201).json({ message: "Category added successfully", data: result });
    } catch (error) {
        console.error("Error adding category:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// DELETE a category by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const query = { _id: new ObjectId(id) };
        const result = await categoriesCollection.deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Category with ID ${id} not found` });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT update a category by ID
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };

        const updateCategoryData = {
            $set: {
                name: updateData.name,
                description: updateData.description,
                updatedBy: updateData.updatedBy,
                updatedAt: new Date()
            }
        };

        const result = await categoriesCollection.updateOne(filter, updateCategoryData, options);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: `Category with ID ${id} not found` });
        }

        res.status(200).json({ message: "Category updated successfully", result });
    } catch (error) {
        console.error("Error updating category:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Helper function to validate category data
function validateCategory(category) {
    const requiredFields = ['name'];
    for (const field of requiredFields) {
        if (!category[field]) {
            return false;
        }
    }
    return true;
}

module.exports = router;