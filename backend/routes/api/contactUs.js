const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// MongoDB connection URI
const uri = `mongodb+srv://hett:diptesh79@quickmeds.f6ryx.mongodb.net/contactDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const contactCollection = client.db('mail').collection('contact');

    try {
        await client.connect();

        // GET all contact messages
        router.get('/', async (req, res) => {
            const query = {};
            const cursor = contactCollection.find(query);

            const messages = await cursor.toArray();

            if ((await cursor?.countDocuments) === 0) {
                res.status(404).send("No contact messages found");
            } else {
                res.status(200).send(messages);
            }
        });

        // GET a single contact message by ID
        router.get('/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const message = await contactCollection.findOne(query);

            if (message) {
                res.status(200).json(message);
            } else {
                res.status(404).json({ message: `Contact message with ID ${id} not found!` });
            }
        });

        // POST a new contact message
        router.post('/', async (req, res) => {
            const newMessage = req.body;

            // Validate required fields
            if (!newMessage.name || !newMessage.email || !newMessage.message) {
                return res.status(400).json({ error: "Name, email, and message are required fields." });
            }

            const result = await contactCollection.insertOne(newMessage);

            if (result.insertedId) {
                res.status(201).json({ message: "Message sent successfully!", messageId: result.insertedId });
            } else {
                res.status(500).json({ error: "Failed to send message." });
            }
        });

        // DELETE a contact message by ID
        router.delete('/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await contactCollection.deleteOne(query);

            if (result.deletedCount === 1) {
                res.status(200).json({ message: "Message deleted successfully!" });
            } else {
                res.status(404).json({ error: `Message with ID ${id} not found.` });
            }
        });

        // PUT (update) a contact message by ID
        router.put('/:id', async (req, res) => {
            const id = req.params.id;
            const updatedMessage = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateData = {
                $set: {
                    name: updatedMessage.name,
                    email: updatedMessage.email,
                    message: updatedMessage.message,
                    sendCopy: updatedMessage.sendCopy,
                },
            };

            const result = await contactCollection.updateOne(filter, updateData, options);

            if (result.modifiedCount > 0 || result.upsertedCount > 0) {
                res.status(200).json({ message: "Message updated successfully!" });
            } else {
                res.status(404).json({ error: `Message with ID ${id} not found.` });
            }
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).json({ error: "Internal server error." });
    } finally {
        // Optionally close the connection when done
        // await client.close();
    }
}

run().catch(console.dir);

module.exports = router;