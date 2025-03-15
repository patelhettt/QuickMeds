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
const companiesCollection = client.db('setup').collection('companies');

// GET all companies
router.get('/', async (req, res) => {
    try {
        const query = {};
        const cursor = companiesCollection.find(query);
        const companies = await cursor.toArray();

        const count = await companiesCollection.countDocuments(query);

        if (count === 0) {
            return res.status(404).json({ message: "No companies found" });
        }

        res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET a company by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }

        const query = { _id: new ObjectId(id) };
        const company = await companiesCollection.findOne(query);

        if (!company) {
            return res.status(404).json({ message: `Company with ID ${id} not found` });
        }

        res.status(200).json(company);
    } catch (error) {
        console.error("Error fetching company:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// POST a new company
router.post('/', async (req, res) => {
    try {
        const newCompany = req.body;

        if (!validateCompany(newCompany)) {
            return res.status(400).json({ message: "Invalid company data" });
        }

        const result = await companiesCollection.insertOne(newCompany);
        res.status(201).json({ message: "Company added successfully", data: result });
    } catch (error) {
        console.error("Error adding company:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// DELETE a company by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }

        const query = { _id: new ObjectId(id) };
        const result = await companiesCollection.deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Company with ID ${id} not found` });
        }

        res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error("Error deleting company:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT update a company by ID
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (!id || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }

        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };

        const updateCompanyData = {
            $set: {
                name: updateData.name,
                phone: updateData.phone,
                website: updateData.website,
                email: updateData.email,
                address: updateData.address,
                updatedBy: updateData.updatedBy,
                updatedAt: new Date()
            }
        };

        const result = await companiesCollection.updateOne(filter, updateCompanyData, options);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: `Company with ID ${id} not found` });
        }

        res.status(200).json({ message: "Company updated successfully", result });
    } catch (error) {
        console.error("Error updating company:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Helper function to validate company data
function validateCompany(company) {
    const requiredFields = ['name', 'phone', 'website', 'email', 'address'];
    for (const field of requiredFields) {
        if (!company[field]) {
            return false;
        }
    }
    return true;
}

module.exports = router;