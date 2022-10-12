const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dlklrg9.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const contactCallection = client.db("address_book").collection("contact");

        app.get('/contact', async (req, res) => {
            const contactAll = await contactCallection.find({}).toArray();
            res.send(contactAll)
        });
        app.post('/contact', async (req, res) => {
            const newuser = req.body;
            const result = await contactCallection.insertOne(newuser)
            res.send(result)
        });
        app.post('/contact/bulk', async (req, res) => {
            const newusers = req.body;
            const result = await contactCallection.insertMany(newusers)
            res.send(result)
        });
        app.patch('/contact/:id', async (req, res) => {
            const { id } = req.params;
            const { name, gender, contact, address, }=req.body;
            const newusers = req.body;
            const result = await contactCallection.insertMany(newusers)
            res.send(result)
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running')
});
module.exports = app