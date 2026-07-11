const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
    },
    rule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrafficRule',
        required: true,
    },
    evidenceImage: {
        type: String,
        required: true, // URL or path to the image
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
    fineAmount: {
        type: Number,
        required: true, // Store snapshot of fine amount at time of violation
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Police officer
        required: true,
    },
    paymentDate: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Violation', violationSchema);
