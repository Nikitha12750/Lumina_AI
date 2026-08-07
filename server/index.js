require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection with fallback to in-memory MongoDB for local dev
async function connectWithFallback() {
    const mongoUri = process.env.MONGO_URI;
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        console.warn('Falling back to in-memory MongoDB for development.');
        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('Connected to in-memory MongoDB');
        } catch (memErr) {
            console.error('In-memory MongoDB failed to start:', memErr);
            // Do not exit here; keep server running so user can see errors and debug
        }
    }
}

connectWithFallback();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/generate', require('./routes/generate'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
