const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectMongo = require('./mongoConnection');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.post('/submit', async (req, res) => {
    try {
        const db = await connectMongo();
        const collection = db.collection('contacts');
        await collection.insertOne(req.body);
        res.send('Message sent successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error submitting message');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await connectMongo();
        const collection = db.collection('users');
        const user = await collection.findOne({ email, password });
        if (user) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/signup', async (req, res) => {
    try {
        const { fullName, country, gender, dob, email, password } = req.body;
        const db = await connectMongo();
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            res.status(400).send('User already exists');
        } else {
            await collection.insertOne({ fullName, country, gender, dob, email, password });
            res.send('Signup successful!');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signing up');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
