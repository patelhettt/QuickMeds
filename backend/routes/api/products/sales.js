const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://hett:diptesh79@quickmeds.f6ryx.mongodb.net/products?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Connect to MongoDB immediately
let db, ordersDb;
let salesCollection;
let pharmacyCollection;
let nonPharmacyCollection;
let billingCollection;
let pharmacyOrdersCollection;

client.connect()
    .then(() => {
        console.log("MongoDB Connected in Sales Route");
        db = client.db('products');
        ordersDb = client.db('orders');
        salesCollection = db.collection('sales');
        pharmacyCollection = db.collection('pharmacy');
        nonPharmacyCollection = db.collection('nonPharmacy');
        billingCollection = db.collection('billing');
        pharmacyOrdersCollection = ordersDb.collection('pharmacy');
    })
    .catch(err => {
        console.error("MongoDB Connection Error in Sales Route:", err);
    });

// Add new sale order
router.post('/', async (req, res) => {
    try {
        if (!salesCollection) {
            return res.status(500).json({ message: "Database connection not ready" });
        }
        
        console.log('Creating new sale with customer ID:', req.body.customer);
        const saleData = req.body;
        
        // Ensure customer is an ObjectId
        if (saleData.customer && typeof saleData.customer === 'string') {
            try {
                saleData.customer = new ObjectId(saleData.customer);
            } catch (err) {
                console.error("Invalid customer ID format:", err);
            }
        }
        
        // 1. Save the sale
        const result = await salesCollection.insertOne(saleData);
        console.log('Sale created with ID:', result.insertedId);
        
        // 2. Create billing record
        const billingData = {
            sale_id: result.insertedId,
            customer: saleData.customer,
            store_name: saleData.store_name,
            payment: saleData.payment,
            items_count: saleData.items.length,
            total_amount: saleData.payment.total,
            date: new Date(),
            soldBy: saleData.soldBy
        };
        
        await billingCollection.insertOne(billingData);
        console.log('Billing record created for sale:', result.insertedId);
        
        // 3. Update inventory by decreasing stock in both places
        if (saleData.items && saleData.items.length > 0) {
            console.log(`Updating inventory for ${saleData.items.length} items in store: ${saleData.store_name}`);
            
            // A. Update products collection stock
            const productUpdatePromises = saleData.items.map(item => {
                // Determine which collection to update
                const collection = item.type === 'nonPharmacy' ? 
                    nonPharmacyCollection : pharmacyCollection;
                
                // Update the stock by decrementing the quantity
                return collection.updateOne(
                    { _id: new ObjectId(item.productId) },
                    { $inc: { stock: -item.quantity } }
                ).then(updateResult => {
                    console.log(`Updated product ${item.productId}: ${updateResult.modifiedCount} modified`);
                    return updateResult;
                }).catch(err => {
                    console.error(`Error updating product inventory for item ${item.productId}:`, err);
                    return null;
                });
            });
            
            // B. Update orders/pharmacy collection for store inventory
            // First find matching orders for this store
            const storeOrders = await pharmacyOrdersCollection.find({ 
                store_name: saleData.store_name,
                status: 'approved'
            }).toArray();
            
            console.log(`Found ${storeOrders.length} approved orders for store: ${saleData.store_name}`);
            
            // For each item in the sale
            for (const item of saleData.items) {
                let remainingQuantity = item.quantity;
                
                // Try to find this item in each store order and decrease its quantity
                for (const order of storeOrders) {
                    if (remainingQuantity <= 0) break;
                    
                    const orderItem = order.items?.find(i => i.itemId === item.productId);
                    if (!orderItem || orderItem.quantity <= 0) continue;
                    
                    const deductAmount = Math.min(remainingQuantity, orderItem.quantity);
                    
                    // Update the order item quantity
                    await pharmacyOrdersCollection.updateOne(
                        { 
                            _id: order._id,
                            "items.itemId": item.productId
                        },
                        { 
                            $inc: { "items.$.quantity": -deductAmount } 
                        }
                    );
                    
                    console.log(`Reduced ${deductAmount} from order ${order._id} for item ${item.productId}`);
                    remainingQuantity -= deductAmount;
                }
                
                if (remainingQuantity > 0) {
                    console.warn(`Could not fully deduct item ${item.productId} from store orders (${remainingQuantity} remaining)`);
                }
            }
            
            // Wait for product updates to complete
            await Promise.all(productUpdatePromises);
        }
        
        res.status(201).json({
            _id: result.insertedId,
            order_id: `ORD-${Date.now().toString().slice(-8)}`,
            message: 'Sale created successfully and inventory updated'
        });
    } catch (error) {
        console.error("Error creating sale:", error);
        res.status(500).json({ message: "Failed to create sale", error: error.message });
    }
});

module.exports = router;