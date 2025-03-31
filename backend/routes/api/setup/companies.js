const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

connectToDatabase();

const companiesCollection = client.db('setup').collection('companies');

// ✅ GET all companies
router.get('/', async (req, res) => {
    try {
        const companies = await companiesCollection.find().toArray();
        if (!companies.length) {
            return res.status(404).json({ message: "No companies found" });
        }
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ GET a company by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }

        const company = await companiesCollection.findOne({ _id: new ObjectId(id) });
        if (!company) {
            return res.status(404).json({ message: `Company with ID ${id} not found` });
        }

        res.status(200).json(company);
    } catch (error) {
        console.error("Error fetching company:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ POST a new company
router.post('/', async (req, res) => {
    try {
        const { Name, Phone, Website, Email, Address, Creator = 'Admin', UpdatedBy = 'Admin' } = req.body;

        if (!Name || !Phone || !Email || !Address) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        // Get the next SN value
        const lastCompany = await companiesCollection.find().sort({ SN: -1 }).limit(1).toArray();
        const nextSN = lastCompany.length ? lastCompany[0].SN + 1 : 1;

        const newCompany = {
            SN: nextSN,
            Name,
            Phone,
            Website,
            Email,
            Address,
            Creator,
            CreatedAt: new Date().toISOString(),
            UpdatedBy,
            UpdatedAt: new Date().toISOString()
        };

        const result = await companiesCollection.insertOne(newCompany);
        
        // MongoDB Node.js driver v4.0+ doesn't return ops array
        // Instead, we need to fetch the inserted document
        const insertedCompany = await companiesCollection.findOne({ _id: result.insertedId });
        
        res.status(201).json({ 
            message: "Company added successfully", 
            data: insertedCompany 
        });
    } catch (error) {
        console.error("Error adding company:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ DELETE a company by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }

        const result = await companiesCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Company with ID ${id} not found` });
        }

        res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error("Error deleting company:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ PUT update a company by ID
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }

        const { Name, Phone, Website, Email, Address, UpdatedBy = "Admin" } = req.body;

        if (!Name || !Phone || !Website || !Email || !Address) {
            return res.status(400).json({ message: "All fields are required for update" });
        }

        const updateData = {
            $set: {
                Name,
                Phone,
                Website,
                Email,
                Address,
                UpdatedBy,
                UpdatedAt: new Date().toISOString()
            }
        };

        const result = await companiesCollection.updateOne({ _id: new ObjectId(id) }, updateData);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: `Company with ID ${id} not found` });
        }

        res.status(200).json({ message: "Company updated successfully" });
    } catch (error) {
        console.error("Error updating company:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
