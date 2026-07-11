const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    role: {
        type: String,
        enum: ['admin', 'police', 'citizen'],
        default: 'citizen',
    },
    vehicleNumber: {
        type: String,
        // unique: true, // A citizen might have multiple vehicles, or we can just link violations to vehicle number directly without user account for simplest flow.
        // But requirements say "Citizen logs in". So let's keep it.
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
