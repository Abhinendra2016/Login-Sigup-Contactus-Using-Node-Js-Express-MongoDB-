const { MongoClient } = require('mongodb');

// MongoDB connection URL
const url = '';
const dbName = 'contact_form';

async function connectMongo() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(dbName);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
}

module.exports = connectMongo;
