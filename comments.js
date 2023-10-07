// Create web server
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const cors = require('cors');

// Create Mongo DB
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'comments';
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create Cors
app.use(cors());

// Connect Mongo DB
client.connect(function (err) {
    if (err) throw err;
    console.log("Connected successfully to server");
});

// Get All Comments
app.get('/comments', function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('comments');
    collection.find({}).toArray(function (err, docs) {
        if (err) throw err;
        res.json(docs);
    });
});

// Post Comment
app.post('/comments', function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('comments');
    collection.insertOne(req.body, function (err, result) {
        if (err) throw err;
        res.json(result.ops[0]);
    });
});

// Delete Comment
app.delete('/comments/:id', function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('comments');
    collection.deleteOne({ _id: new mongo.ObjectID(req.params.id) }, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// Put Comment
app.put('/comments/:id', function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('comments');
    collection.updateOne({ _id: new mongo.ObjectID(req.params.id) }, { $set: { text: req.body.text } }, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// Start Server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));