const express = require('express');
const router = express.Router();
const { User, Pharmacy } = require('../models/Pharmacy');

// Get paginated User products
// Get paginated User products or all products
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, all } = req.query;

        if (all === 'true') {
            // Fetch all products without pagination
            const allProducts = await Pharmacy.find();
            const total = await Pharmacy.countDocuments(); // Total count

            return res.status(200).json({
                data: allProducts,
                totalItems: total
            });
        }

        // Pagination logic
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);

        const skip = (parsedPage - 1) * parsedLimit;

        const UserProducts = await Pharmacy.find().skip(skip).limit(parsedLimit);
        const total = await Pharmacy.countDocuments();

        res.status(200).json({
            data: UserProducts,
            currentPage: parsedPage,
            totalPages: Math.ceil(total / parsedLimit),
            totalItems: total
        });
    } catch (error) {
        console.error('Error fetching User products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all unique categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Pharmacy.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all unique companies
router.get('/companies', async (req, res) => {
    try {
        const companies = await Pharmacy.distinct('company');
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all unique unit types
router.get('/unitTypes', async (req, res) => {
    try {
        const unitTypes = await Pharmacy.distinct('unitTp');
        res.status(200).json(unitTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a User product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Pharmacy.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'User product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Invalid ID format or product not found' });
    }
});

// Add a new User product
router.post('/', async (req, res) => {
    try {
        const { tradeName, genericName, category, strength, company, stock, packType, packSize, packTp, unitTp, packMrp, unitMrp } = req.body;

        if (!tradeName || !genericName || !category || !company || !stock) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newProduct = new Pharmacy({
            tradeName,
            genericName,
            category,
            strength,
            company,
            stock,
            packType,
            packSize,
            packTp,
            unitTp,
            packMrp,
            unitMrp,
            addedBy: 'admin',
            addedToDbAt: new Date(),
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a User product
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Pharmacy.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'User product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a User product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Pharmacy.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'User product not found' });
        }
        res.status(200).json({ message: 'User product deleted successfully', deletedProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
