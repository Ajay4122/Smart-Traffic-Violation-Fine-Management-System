const express = require('express');
const router = express.Router();
const { getRules, createRule, updateRule, deleteRule } = require('../controllers/ruleController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getRules).post(protect, adminOnly, createRule);
router.route('/:id').put(protect, adminOnly, updateRule).delete(protect, adminOnly, deleteRule);

module.exports = router;
