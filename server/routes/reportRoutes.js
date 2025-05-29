const express = require('express');
const { generateReport, exportReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/generate', generateReport);
router.get('/export', exportReport);

module.exports = router;