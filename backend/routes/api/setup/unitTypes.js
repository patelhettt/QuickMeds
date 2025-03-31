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
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

connectToDatabase();

const unitTypesCollection = client.db('setup').collection('unitTypes');

// ✅ GET all unit types
router.get('/', async (req, res) => {
    try {
        const unitTypes = await unitTypesCollection.find().sort({ SN: 1 }).toArray();
        if (!unitTypes.length) {
            return res.status(404).json({ message: "No unit types found" });
        }
        res.status(200).json(unitTypes);
    } catch (error) {
        console.error("Error fetching unit types:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ GET a unit type by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid unit type ID" });
        }

        const unitType = await unitTypesCollection.findOne({ _id: new ObjectId(id) });
        if (!unitType) {
            return res.status(404).json({ message: `Unit type with ID ${id} not found` });
        }

        res.status(200).json(unitType);
    } catch (error) {
        console.error("Error fetching unit type:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ POST a new unit type
router.post('/', async (req, res) => {
    try {
        const { Name, Description, Creator = 'Admin', UpdatedBy = 'Admin' } = req.body;

        if (!Name || !Description) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        // Check if the unit type name already exists
        const existingUnitType = await unitTypesCollection.findOne({ Name });
        if (existingUnitType) {
            return res.status(400).json({ message: "Unit type with this name already exists." });
        }

        // Get the next SN value
        const lastUnitType = await unitTypesCollection.find().sort({ SN: -1 }).limit(1).toArray();
        const nextSN = lastUnitType.length ? lastUnitType[0].SN + 1 : 1;

        const newUnitType = {
            SN: nextSN,
            Name,
            Description,
            Creator,
            CreatedAt: new Date().toISOString(),
            UpdatedBy,
            UpdatedAt: new Date().toISOString()
        };

        const result = await unitTypesCollection.insertOne(newUnitType);
        const insertedUnitType = await unitTypesCollection.findOne({ _id: result.insertedId });

        res.status(201).json({
            message: "Unit Type added successfully",
            data: insertedUnitType
        });
    } catch (error) {
        console.error("Error adding unit type:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ DELETE a unit type by ID
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid unit type ID" });
        }

        const result = await unitTypesCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Unit type with ID ${id} not found` });
        }

        // Reorder SN for remaining unit types
        const unitTypes = await unitTypesCollection.find().sort({ CreatedAt: 1 }).toArray();
        for (let i = 0; i < unitTypes.length; i++) {
            await unitTypesCollection.updateOne(
                { _id: unitTypes[i]._id },
                { $set: { SN: i + 1 } }
            );
        }

        res.status(200).json({ message: "Unit type deleted successfully" });
    } catch (error) {
        console.error("Error deleting unit type:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ PUT update a unit type by ID
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid unit type ID" });
        }

        const { Name, Description, UpdatedBy = "Admin" } = req.body;

        if (!Name || !Description) {
            return res.status(400).json({ message: "All fields are required for update" });
        }

        const updateData = {
            $set: {
                Name,
                Description,
                UpdatedBy,
                UpdatedAt: new Date().toISOString()
            }
        };

        const result = await unitTypesCollection.updateOne({ _id: new ObjectId(id) }, updateData);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: `Unit type with ID ${id} not found` });
        }

        res.status(200).json({ message: "Unit type updated successfully" });
    } catch (error) {
        console.error("Error updating unit type:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
