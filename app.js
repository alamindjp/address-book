const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express()
const ObjectId = require('mongodb').ObjectId

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dlklrg9.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    next()
}

async function run() {
    try {
        await client.connect();
        const contactCallection = client.db("address_book").collection("contact");

        app.get('/contact/:id', verifyJWT, async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) }
            const result = await contactCallection.findOne(query)
            res.send(result)
        });
        app.get('/contact/search/:name', verifyJWT, async (req, res) => {
            const name= req.params.name;
            const result = await contactCallection.find({name: name}).toArray();
            res.send(result)
        });
        app.get('/contact', verifyJWT, async (req, res) => {
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)
            let contacts;
            if (limit || page) {
                contacts = await contactCallection.find({}).skip(page * limit).limit(limit).toArray();
            }
            else {
                contacts = await contactCallection.find({}).toArray();
            }
            res.send(contacts)
        });
        app.post('/contact', verifyJWT, async (req, res) => {
            console.log('doen')
            const newusers = req.body;
            const result = await contactCallection.insertOne(newusers)
            res.send(newusers)
        });
        app.post('/contact/bulk', verifyJWT, async (req, res) => {
            const newusers = req.body;
            const result = await contactCallection.insertMany(newusers)
            res.send(result)
        });
        app.put('/contact/:id', verifyJWT, async (req, res) => {
            const { id } = req.params;
            const updateUser = req.body;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: updateUser,
            };
            const result = await contactCallection.updateOne(query, updateDoc, options)
            res.send(result)
        });
        app.delete('/contact/:id', verifyJWT, async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) }
            const result = await contactCallection.deleteOne(query)
            res.send(result)
        });
        
    }
    catch {
        
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running')
});
module.exports = app