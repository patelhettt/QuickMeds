const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://hett:diptesh79@quickmeds.f6ryx.mongodb.net/products?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Connect to MongoDB once at the beginning
let pharmacyOrdersCollection;

(async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB for pharmacy orders");
    pharmacyOrdersCollection = client.db('orders').collection('pharmacy');
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

// get all pharmacy orders
router.get('/', async (req, res) => {
  try {
    const query = {};
    const cursor = pharmacyOrdersCollection.find(query);
    const pharmacyOrders = await cursor.toArray();

    if ((await pharmacyOrdersCollection.countDocuments(query)) === 0) {
      res.status(400).send("No pharmacy orders found");
    } else {
      res.status(200).send(pharmacyOrders);
    }
  } catch (error) {
    console.error("Error fetching pharmacy orders:", error);
    res.status(500).send("Server error");
  }
});

// get a pharmacy order by id
router.get('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;

    if (!id || id === 'undefined') {
      return res.status(400).json({ message: `Invalid order ID` });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Invalid order ID format` });
    }

    const query = { _id: new ObjectId(id) };
    const pharmacyOrder = await pharmacyOrdersCollection.findOne(query);

    if (pharmacyOrder) {
      res.status(200).json(pharmacyOrder);
    } else {
      res.status(404).json({ message: `Pharmacy order with ID ${id} not found!` });
    }
  } catch (error) {
    console.error("Error fetching pharmacy order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// add new pharmacy order
router.post('/', async (req, res) => {
  try {
    const newPharmacyOrder = req?.body;
    
    // Add default values if not provided
    if (!newPharmacyOrder.status) {
      newPharmacyOrder.status = 'pending';
    }
    if (!newPharmacyOrder.requestedAt) {
      newPharmacyOrder.requestedAt = new Date();
    }
    if (!newPharmacyOrder.items) {
      newPharmacyOrder.items = [];
    }
    
    const result = await pharmacyOrdersCollection.insertOne(newPharmacyOrder);
    res.status(201).json({ 
      success: true,
      message: "Pharmacy order created successfully",
      orderId: result.insertedId
    });
  } catch (error) {
    console.error("Error creating pharmacy order:", error);
    res.status(500).json({ 
      success: false,
      message: "Error creating pharmacy order", 
      error: error.message 
    });
  }
});

// delete a pharmacy order
router.delete('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    
    const query = { _id: new ObjectId(id) };
    const result = await pharmacyOrdersCollection.deleteOne(query);

    if (result.deletedCount === 1) {
      res.json({ 
        success: true,
        message: "Order deleted successfully" 
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
  } catch (error) {
    console.error("Error deleting pharmacy order:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting pharmacy order", 
      error: error.message 
    });
  }
});

// update a pharmacy order data
router.put('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    
    const updatePharmacyOrder = req?.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatePharmacyOrderData = {
      $set: updatePharmacyOrder
    };

    const result = await pharmacyOrdersCollection.updateOne(filter, updatePharmacyOrderData, options);

    if (result.matchedCount === 1) {
      res.json({ 
        success: true,
        message: "Order updated successfully" 
      });
    } else {
      res.json({ 
        success: true,
        message: "Order created successfully" 
      });
    }
  } catch (error) {
    console.error("Error updating pharmacy order:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating pharmacy order", 
      error: error.message 
    });
  }
});

// Approve a pharmacy order
router.patch('/:id/approve', async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const filter = { _id: new ObjectId(id) };
    const order = await pharmacyOrdersCollection.findOne(filter);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot approve order with status: ${order.status}`,
        success: false 
      });
    }
    
    const updateData = {
      $set: { 
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: req.body.approvedBy || 'admin'
      }
    };
    
    const result = await pharmacyOrdersCollection.updateOne(filter, updateData);
    
    if (result.modifiedCount === 1) {
      res.json({ 
        message: 'Order approved successfully',
        success: true 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to approve order',
        success: false 
      });
    }
  } catch (error) {
    console.error('Error approving order:', error);
    res.status(500).json({ 
      message: 'Server error during order approval',
      success: false,
      error: error.message 
    });
  }
});

// Reject a pharmacy order
router.patch('/:id/reject', async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const filter = { _id: new ObjectId(id) };
    const order = await pharmacyOrdersCollection.findOne(filter);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot reject order with status: ${order.status}`,
        success: false 
      });
    }
    
    const updateData = {
      $set: { 
        status: 'rejected',
        rejectedAt: new Date(),
        rejectedBy: req.body.rejectedBy || 'admin',
        rejectionReason: req.body.rejectionReason || 'No reason provided'
      }
    };
    
    const result = await pharmacyOrdersCollection.updateOne(filter, updateData);
    
    if (result.modifiedCount === 1) {
      res.json({ 
        message: 'Order rejected successfully',
        success: true 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to reject order',
        success: false 
      });
    }
  } catch (error) {
    console.error('Error rejecting order:', error);
    res.status(500).json({ 
      message: 'Server error during order rejection',
      success: false,
      error: error.message 
    });
  }
});

// Handle process termination
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

module.exports = router;