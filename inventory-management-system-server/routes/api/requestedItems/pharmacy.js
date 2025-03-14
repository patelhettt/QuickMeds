const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://hett:diptesh79@quickmeds.f6ryx.mongodb.net/products?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const pharmacyRequestedItemsCollection = client.db('requestedItems').collection('Pharmacy');

    try {
        await client.connect();

        // get all non pharmacy requested items
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = pharmacyRequestedItemsCollection.find(query);

            const pharmacyRequestedItems = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(400).send("No non pharmacy requested items found");
            }
            else {
                res.status(200).send(pharmacyRequestedItems)
            }
        });

        // get a non pharmacy requested items by id
        router.get('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const pharmacyRequestedItems = await pharmacyRequestedItemsCollection.findOne(query);

            if (pharmacyRequestedItems) {
                res.status(200).json(pharmacyRequestedItems);
            } else {
                res.status(400).json({ message: `Non Pharmacy requested items with ${req.params.id} not found!` });
            }
        });

        // add new non pharmacy requested items
        router.post('/', async (req, res) => {
            const newPharmacyRequestedItems = req?.body;
            const newItems = await pharmacyRequestedItemsCollection.insertOne(newPharmacyRequestedItems);

            res.send(newItems);
        });

        // delete a non pharmacy requested items
        router.delete('/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const deletedPharmacyRequestedItem = await pharmacyRequestedItemsCollection.deleteOne(query);

            res.send(deletedPharmacyRequestedItem);
        });

        // update a non pharmacy requested item data
        router.put('/:id', async (req, res) => {
            const id = req?.params?.id;
            const updatePharmacyRequestedItem = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatePharmacyRequestedItemData = {
                $set: {
                    name: updatePharmacyRequestedItem.name
                }
            };

            const updatedRequestedItem = await pharmacyRequestedItemsCollection.updateOne(filter, updatePharmacyRequestedItemData, options);

            res.send(updatedRequestedItem);
        });

    } finally {
        // await client.close();
    };
}

run().catch(console.dir);

module.exports = router;