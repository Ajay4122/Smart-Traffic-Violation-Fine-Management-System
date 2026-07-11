const Violation = require('../models/Violation');
const TrafficRule = require('../models/TrafficRule');

// @desc    Record a new violation
// @route   POST /api/violations
// @access  Private (Police/Admin)
const recordViolation = async (req, res) => {
    try {
        const { vehicleNumber, ruleId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an evidence image' });
        }

        const rule = await TrafficRule.findById(ruleId);
        if (!rule) {
            return res.status(404).json({ message: 'Traffic rule not found' });
        }

        const violation = await Violation.create({
            vehicleNumber,
            rule: ruleId,
            evidenceImage: req.file.path, // Store local path or URL
            fineAmount: rule.fineAmount,
            recordedBy: req.user._id,
            status: 'Pending'
        });

        res.status(201).json(violation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all violations (Admin/Police view all, Citizen view by vehicle)
// @route   GET /api/violations
// @access  Private (Admin/Police) or Public (with query generic search?)
// Implementing as Private for Admin/Police and a separate public search or user-based specific
const getViolations = async (req, res) => {
    try {
        const violations = await Violation.find()
            .populate('rule', 'ruleName fineAmount')
            .populate('recordedBy', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(violations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search violations by vehicle number
// @route   GET /api/violations/search/:vehicleNumber
// @access  Public
const searchViolations = async (req, res) => {
    try {
        const violations = await Violation.find({ vehicleNumber: req.params.vehicleNumber })
            .populate('rule', 'ruleName description fineAmount')
            .sort({ createdAt: -1 });
        res.status(200).json(violations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Pay fine
// @route   PUT /api/violations/:id/pay
// @access  Public (Citizen)
const payFine = async (req, res) => {
    try {
        const violation = await Violation.findById(req.params.id);

        if (!violation) {
            return res.status(404).json({ message: 'Violation not found' });
        }

        if (violation.status === 'Paid') {
            return res.status(400).json({ message: 'Fine already paid' });
        }

        violation.status = 'Paid';
        violation.paymentDate = Date.now();

        await violation.save();

        res.status(200).json(violation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get analytics
// @route   GET /api/violations/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
    try {
        const totalViolations = await Violation.countDocuments();
        const pendingViolations = await Violation.countDocuments({ status: 'Pending' });
        const collectedFines = await Violation.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$fineAmount' } } }
        ]);

        const totalRevenue = collectedFines.length > 0 ? collectedFines[0].total : 0;

        res.status(200).json({
            totalViolations,
            pendingViolations,
            paidViolations: totalViolations - pendingViolations,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    recordViolation,
    getViolations,
    searchViolations,
    payFine,
    getAnalytics
};
