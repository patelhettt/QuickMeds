const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// POST /api/inventory/update - Update inventory
router.post('/update', async (req, res) => {
  try {
    const { items, store } = req.body;
    const bulkOps = [];
    
    // Get the orders collection 
    const orderCollection = mongoose.connection.collection('orders');
    
    // Prepare bulk operations to update inventory
    for (const item of items) {
      bulkOps.push({
        updateOne: {
          filter: { 
            "items.itemId": item.productId,
            "store_name": store
          },
          update: { 
            $inc: { "items.$.quantity": -item.quantity } 
          }
        }
      });
    }
    
    if (bulkOps.length > 0) {
      await orderCollection.bulkWrite(bulkOps);
    }
    
    res.status(200).json({ 
      message: 'Inventory updated successfully' 
    });
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
