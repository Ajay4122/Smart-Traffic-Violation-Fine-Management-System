const express = require('express');
const router = express.Router();
const {
    recordViolation,
    getViolations,
    searchViolations,
    payFine,
    getAnalytics
} = require('../controllers/violationController');
const { protect, policeOnly, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, policeOnly, upload.single('evidenceImage'), recordViolation);
router.get('/', protect, policeOnly, getViolations); // Police/Admin view all
router.get('/search/:vehicleNumber', searchViolations); // Public search
router.put('/:id/pay', payFine); // Public pay (mock)
router.get('/analytics', protect, adminOnly, getAnalytics);

module.exports = router;
