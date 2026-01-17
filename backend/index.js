const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://hett:diptesh79@quickmeds.f6ryx.mongodb.net/products?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1); 
    });



//billing 
app.use('/api/bill', require('./routes/api/bill'));

// Auth Routes
app.use('/api/auth', require('./routes/api/auth/auth'));

// Routes
app.use('/api/products/auth', require('./routes/api/auth/auth'));
app.use('/api/products/employees', require('./routes/api/employees/users'));
app.use('/api/products/customers', require('./routes/api/customers/customers'));
app.use('/api/update', require('./routes/api/auth/auth'));

// Products API Routes
app.use('/api/products/pharmacy', require('./routes/api/products/pharmacy'));
app.use('/api/products/nonPharmacy', require('./routes/api/products/nonPharmacy'));

// Requested Items API Routes
app.use('/api/requestedItems/pharmacy', require('./routes/api/requestedItems/pharmacy'));
app.use('/api/requestedItems/nonPharmacy', require('./routes/api/requestedItems/nonPharmacy'));

// POS API Routes
app.use('/api/sales', require('./routes/api/products/sales'));

//Orders API Routes
app.use('/api/orders/pharmacy', require('./routes/api/orders/pharmacy'));
app.use('/api/orders/nonPharmacy', require('./routes/api/orders/nonPharmacy'));

// Purchases API Routes
app.use('/api/purchases/pharmacy', require('./routes/api/purchases/pharmacy')); 
app.use('/api/purchases/nonPharmacy', require('./routes/api/purchases/nonPharmacy')); 

// Setup API Routes
app.use('/api/setup/categories', require('./routes/api/setup/categories'));
app.use('/api/setup/companies', require('./routes/api/setup/companies'));
app.use('/api/setup/unitTypes', require('./routes/api/setup/unitTypes'));

// Returns API Routes
app.use('/api/returns/customers', require('./routes/api/returns/customersReturns'));
app.use('/api/returns/expiresOrDamagesReturns', require('./routes/api/returns/expiresOrDamagesReturns'));

// Suppliers API Routes
app.use('/api/suppliers/documents', require('./routes/api/suppliers/documents'));
app.use('/api/suppliers/lists', require('./routes/api/suppliers/lists'));
app.use('/api/suppliers/payments', require('./routes/api/suppliers/payments'));

// Contact Us API Routes
app.use('/api/contactUs', require('./routes/api/contactUs'));

// Customer API Route
app.use('/api/customer', require('./routes/api/customers/customers'));

// Sales API Route
app.use('/api/sales', require('./routes/api/products/sales'));

// Inventory API Route
app.use('/api/inventory', require('./routes/api/inventory'));

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
