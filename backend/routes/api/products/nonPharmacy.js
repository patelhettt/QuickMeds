const express = require('express');
const router = express.Router();
const { NonPharmacy } = require('../models/NonPharmacy'); // Import the NonPharmacy model

// Get paginated or all non-pharmacy products
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, all } = req.query;

        if (all === 'true') {
            // Fetch all non-pharmacy products without pagination
            const allProducts = await NonPharmacy.find();
            const total = await NonPharmacy.countDocuments(); // Total count

            return res.status(200).json({
                data: allProducts,
                totalItems: total
            });
        }

        // Pagination logic
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);

        const skip = (parsedPage - 1) * parsedLimit;

        const products = await NonPharmacy.find().skip(skip).limit(parsedLimit);
        const total = await NonPharmacy.countDocuments();

        res.status(200).json({
            data: products,
            currentPage: parsedPage,
            totalPages: Math.ceil(total / parsedLimit),
            totalItems: total
        });
    } catch (error) {
        console.error('Error fetching non-pharmacy products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all unique categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await NonPharmacy.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all unique companies
router.get('/companies', async (req, res) => {
    try {
        const companies = await NonPharmacy.distinct('company');
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a non-pharmacy product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await NonPharmacy.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Non-pharmacy product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Invalid ID format or product not found' });
    }
});

// Add a new non-pharmacy product
router.post('/', async (req, res) => {
    try {
        const { productName, category, company, stock, packType, packSize, packTp, unitTp, packMrp, unitMrp } = req.body;

        if (!productName || !category || !company || !stock) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newProduct = new NonPharmacy({
            productName,
            category,
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

// Update a non-pharmacy product
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await NonPharmacy.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Non-pharmacy product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a non-pharmacy product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await NonPharmacy.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Non-pharmacy product not found' });
        }
        res.status(200).json({ message: 'Non-pharmacy product deleted successfully', deletedProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;