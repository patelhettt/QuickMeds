const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://hett:diptesh79@quickmeds.f6ryx.mongodb.net/products?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1); // Terminate the process if the connection fails
    });

// Routes
app.use('/api/products/auth', require('./routes/api/auth/auth'));
app.use('/api/products/employees', require('./routes/api/employees/employees'));
app.use('/api/products/customers', require('./routes/api/customers/customers'));

// Products API Routes
app.use('/api/products/pharmacy', require('./routes/api/products/pharmacy'));
app.use('/api/products/nonPharmacy', require('./routes/api/products/nonPharmacy'));

// Requested Items API Routes
app.use('/api/requestedItems/pharmacy', require('./routes/api/requestedItems/pharmacy'));
app.use('/api/requestedItems/nonPharmacy', require('./routes/api/requestedItems/nonPharmacy'));

// Orders API Routes
app.use('/api/products/sales', require('./routes/api/orders/pharmacy'));
//app.use('/api/orders/nonPharmacy', require('./routes/api/orders/nonPharmacy'));

// Purchases API Routes
app.use('/api/purchases/pharmacy', require('./routes/api/orders/pharmacy')); // Duplicate of /api/orders/pharmacy
app.use('/api/purchases/nonPharmacy', require('./routes/api/orders/nonPharmacy')); // Duplicate of /api/orders/nonPharmacy

// Setup API Routes
app.use('/api/products/categories', require('./routes/api/setup/categories'));
app.use('/api/products/companies', require('./routes/api/setup/companies'));
app.use('/api/products/unitTypes', require('./routes/api/setup/unitTypes'));

// Returns API Routes
app.use('/api/returns/customers', require('./routes/api/returns/customersReturns'));
app.use('/api/returns/expiresOrDamagesReturns', require('./routes/api/returns/expiresOrDamagesReturns'));

// Suppliers API Routes
app.use('/api/products/documents', require('./routes/api/suppliers/documents'));
app.use('/api/products/lists', require('./routes/api/suppliers/lists'));
app.use('/api/products/payments', require('./routes/api/suppliers/payments'));

// Contact Us API Routes
app.use('/api/contactUs', require('./routes/api/contactUs'));

// Index Route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Inventory Management System Server",
        documentation: "https://example.com/api-docs", // Add API documentation link here
        version: "1.0.0"
    });
});

// Invalid Route Handler
app.all('*', (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});