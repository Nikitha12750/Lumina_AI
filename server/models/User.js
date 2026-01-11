const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    prompt: { type: String, required: true },
    contentType: { type: String, required: true },
    tone: { type: String, required: true },
    response: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 5 },
    history: [HistorySchema]
});

module.exports = mongoose.model('User', UserSchema);
