const express = require('express');
const router = express.Router();
const { Pharmacy } = require('../models/Pharmacy');

// Get total count of pharmacy products
router.get('/count', async (req, res) => {
    try {
        const totalProducts = await Pharmacy.countDocuments();
        res.status(200).json({ totalProducts });
    } catch (error) {
        console.error('Error fetching pharmacy product count:', error);
        res.status(500).json({ 
            error: 'Failed to fetch product count',
            details: error.message 
        });
    }
});

// Get paginated pharmacy products with search and filters
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = ''
        } = req.query;

        // Build search query
        let query = {};
        if (search) {
            query = {
                $or: [
                    { tradeName: { $regex: search, $options: 'i' } },
                    { genericName: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                    { company: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Execute query with pagination
        const [products, total] = await Promise.all([
            Pharmacy.find(query)
                .sort({ tradeName: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Pharmacy.countDocuments(query)
        ]);

        res.status(200).json({
            data: products,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        });
    } catch (error) {
        console.error('Error fetching pharmacy products:', error);
        res.status(500).json({ 
            error: 'Failed to fetch products',
            details: error.message 
        });
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
        const unitTypes = await Pharmacy.distinct('unitType');
        res.status(200).json(unitTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a pharmacy product by ID - THIS SHOULD COME AFTER ALL OTHER SPECIFIC ROUTES
router.get('/:id', async (req, res) => {
    try {
        const product = await Pharmacy.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Invalid ID format or product not found' });
    }
});

// Add a new pharmacy product
router.post('/', async (req, res) => {
    try {
        const { 
            tradeName, 
            genericName, 
            strength, 
            category, 
            company, 
            unitType,
            stock
        } = req.body;

        // Validate required fields
        if (!tradeName || !genericName || !strength || !category || !company || !unitType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newProduct = new Pharmacy({
            tradeName,
            genericName,
            strength,
            category,
            company,
            unitType,
            stock: stock || 0
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a pharmacy product
router.put('/:id', async (req, res) => {
    try {
        const { 
            tradeName, 
            genericName, 
            strength, 
            category, 
            company, 
            unitType,
            stock
        } = req.body;

        // Validate required fields
        if (!tradeName || !genericName || !strength || !category || !company || !unitType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const updatedProduct = await Pharmacy.findByIdAndUpdate(
            req.params.id,
            {
                tradeName,
                genericName,
                strength,
                category,
                company,
                unitType,
                stock: stock || 0
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a pharmacy product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Pharmacy.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
