const express = require('express');
const {
  getCalls,
  getCall,
  createCall,
  updateCall,
  deleteCall,
  getAgentCalls,
  getEscalatedCalls,
  getDashboardStats,
  respondToCall
} = require('../controllers/callController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('agent', 'supervisor', 'admin'), getCalls)
  .post(authorize('agent'), createCall);

router.route('/agent')
  .get(authorize('agent'), getAgentCalls);

router.route('/escalated')
  .get(authorize('backoffice', 'finance', 'digital', 'shareholder'), getEscalatedCalls);

router.route('/:id')
  .get(getCall)
  .put(updateCall)
  .delete(authorize('admin'), deleteCall);

router.route('/:id/respond')
  .post(respondToCall);

router.route('/stats/dashboard')
  .get(authorize('admin', 'supervisor', 'backoffice', 'finance', 'digital', 'shareholder'), getDashboardStats);

module.exports = router;