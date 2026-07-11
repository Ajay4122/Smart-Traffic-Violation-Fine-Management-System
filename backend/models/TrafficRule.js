const mongoose = require('mongoose');

const trafficRuleSchema = new mongoose.Schema({
    ruleName: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    fineAmount: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('TrafficRule', trafficRuleSchema);
