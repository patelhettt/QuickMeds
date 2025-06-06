const express = require('express');
const router = express.Router();
const { NonPharmacy } = require('../models/NonPharmacy');

// Get total count of non-pharmacy products
router.get('/count', async (req, res) => {
    try {
        const totalProducts = await NonPharmacy.countDocuments();
        res.status(200).json({ totalProducts });
    } catch (error) {
        console.error('Error fetching nonpharmacy product count:', error);
        res.status(500).json({ 
            error: 'Failed to fetch product count',
            details: error.message 
        });
    }
});

// Get paginated non-pharmacy products with search and filters
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 50, 
            search = '', 
            category = '',
            sort = 'Product_name',
            approved = false,
            inInventory = false
        } = req.query;

        // Build query
        let query = {};
        
        // Search functionality
        if (search) {
            query = {
                $or: [
                    { Product_name: { $regex: search, $options: 'i' } },
                    { Company: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Category filter
        if (category && category !== 'All') {
            query.Category = category;
        }

        // Only include products with stock if inInventory is true
        if (inInventory === 'true') {
            query.Stock = { $gt: 0 };
        }

        // Pagination setup
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;

        // Execute query with pagination
        const [products, total] = await Promise.all([
            NonPharmacy.find(query)
                .sort({ [sort]: 1 })
                .skip(skip)
                .limit(parsedLimit)
                .lean(),
            NonPharmacy.countDocuments(query)
        ]);

        // Add hasMore flag
        const hasMore = total > skip + products.length;

        res.status(200).json({
            data: products,
            currentPage: parsedPage,
            totalPages: Math.ceil(total / parsedLimit),
            totalItems: total,
            hasMore,
            itemsPerPage: parsedLimit
        });
    } catch (error) {
        console.error('Error fetching non-pharmacy products:', error);
        res.status(500).json({ 
            error: 'Failed to fetch products',
            details: error.message 
        });
    }
});

// Get all unique categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await NonPharmacy.distinct('Category');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all unique companies
router.get('/companies', async (req, res) => {
    try {
        const companies = await NonPharmacy.distinct('Company');
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a non-pharmacy product by ID - THIS SHOULD COME AFTER ALL OTHER SPECIFIC ROUTES
router.get('/:id', async (req, res) => {
    try {
        const product = await NonPharmacy.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Invalid ID format or product not found' });
    }
});

// Add a new non-pharmacy product
router.post('/', async (req, res) => {
    try {
        const { Product_name, Category, Company, Stock, Unit_MRP } = req.body;

        if (!Product_name || !Category || !Company || !Stock || !Unit_MRP) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newProduct = new NonPharmacy({
            Product_name,
            Category,
            Company,
            Stock,
            Unit_MRP,
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
            return res.status(404).json({ message: 'Product not found' });
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
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;