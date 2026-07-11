const TrafficRule = require('../models/TrafficRule');

// @desc    Get all rules
// @route   GET /api/rules
// @access  Public
const getRules = async (req, res) => {
    try {
        const rules = await TrafficRule.find();
        res.status(200).json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a rule
// @route   POST /api/rules
// @access  Private (Admin)
const createRule = async (req, res) => {
    if (!req.body.ruleName || !req.body.fineAmount) {
        return res.status(400).json({ message: 'Please add rule name and fine amount' });
    }

    try {
        const rule = await TrafficRule.create({
            ruleName: req.body.ruleName,
            description: req.body.description,
            fineAmount: req.body.fineAmount,
        });
        res.status(200).json(rule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a rule
// @route   PUT /api/rules/:id
// @access  Private (Admin)
const updateRule = async (req, res) => {
    try {
        const rule = await TrafficRule.findById(req.params.id);

        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        const updatedRule = await TrafficRule.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedRule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a rule
// @route   DELETE /api/rules/:id
// @access  Private (Admin)
const deleteRule = async (req, res) => {
    try {
        const rule = await TrafficRule.findById(req.params.id);

        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        await rule.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getRules,
    createRule,
    updateRule,
    deleteRule,
};
