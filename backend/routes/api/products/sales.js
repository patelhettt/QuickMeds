const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://hett:diptesh79@quickmeds.f6ryx.mongodb.net/products?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const salesCollection = client.db('products').collection('sales');

    try {
        await client.connect();

        // add new sale order
        router.post('/', async (req, res) => {
            const newSaleOrder = req?.body;
            const newItems = await salesCollection.insertOne(newSaleOrder);

            res.send(newItems);
        });


    } finally {
    };
}

run().catch(console.dir);

module.exports = router;