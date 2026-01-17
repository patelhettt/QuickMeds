const express = require('express');
const router = express.Router();
const Customer = require('./models/Customer');
const Sale = require('./models/Sale');

// POST /api/bill
router.post('/', async (req, res) => {
  try {
    const { customer, sale } = req.body;

    // 1. Upsert customer (by phone and store)
    let dbCustomer = await Customer.findOneAndUpdate(
      { phone: customer.phone, store: customer.store },
      { $set: customer },
      { new: true, upsert: true }
    );

    // 2. Insert sale, referencing the customer
    const saleDoc = new Sale({
      ...sale,
      customer: dbCustomer._id
    });
    await saleDoc.save();

    res.status(201).json({
      message: 'Bill created successfully',
      customer: dbCustomer,
      sale: saleDoc
    });
  } catch (err) {
    console.error('Error in /api/bill:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
