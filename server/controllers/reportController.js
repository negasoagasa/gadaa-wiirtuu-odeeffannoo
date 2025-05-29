const Call = require('../models/Call');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { format } = require('date-fns');

// @desc    Generate report
// @route   POST /api/reports/generate
// @access  Private (Admin)
exports.generateReport = asyncHandler(async (req, res, next) => {
  const { period, date } = req.body;
  
  if (!period || !date) {
    return next(new ErrorResponse('Please provide period and date', 400));
  }

  const reportDate = new Date(date);
  let startDate, endDate, title;
  let query = {};

  switch (period) {
    case 'daily':
      startDate = new Date(reportDate.setHours(0, 0, 0, 0));
      endDate = new Date(reportDate.setHours(23, 59, 59, 999));
      title = `Daily Report for ${format(reportDate, 'MMMM d, yyyy')}`;
      query.createdAt = { $gte: startDate, $lte: endDate };
      break;
    
    case 'weekly':
      startDate = new Date(reportDate);
      startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of week
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      title = `Weekly Report (${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')})`;
      query.createdAt = { $gte: startDate, $lte: endDate };
      break;
    
    case 'monthly':
      startDate = new Date(reportDate.getFullYear(), reportDate.getMonth(), 1);
      endDate = new Date(reportDate.getFullYear(), reportDate.getMonth() + 1, 0);
      title = `Monthly Report for ${format(reportDate, 'MMMM yyyy')}`;
      query.createdAt = { $gte: startDate, $lte: endDate };
      break;
    
    case 'yearly':
      startDate = new Date(reportDate.getFullYear(), 0, 1);
      endDate = new Date(reportDate.getFullYear(), 11, 31);
      title = `Yearly Report for ${reportDate.getFullYear()}`;
      query.createdAt = { $gte: startDate, $lte: endDate };
      break;
    
    default:
      return next(new ErrorResponse('Invalid report period', 400));
  }

  const calls = await Call.find(query).sort('-createdAt').limit(10);
  const totalCalls = await Call.countDocuments(query);
  const solvedCalls = await Call.countDocuments({ ...query, status: 'solved' });
  const escalatedCalls = await Call.countDocuments({ ...query, status: 'escalated' });
  const pendingCalls = await Call.countDocuments({ ...query, status: 'pending' });

  res.status(200).json({
    success: true,
    data: {
      title,
      totalCalls,
      solvedCalls,
      escalatedCalls,
      pendingCalls,
      calls
    }
  });
});

// @desc    Export report to CSV
// @route   GET /api/reports/export
// @access  Private (Admin)
exports.exportReport = asyncHandler(async (req, res, next) => {
  const { period, date } = req.query;
  
  // Same report generation logic as above
  // Then convert to CSV and send as file download
  // Implementation omitted for brevity
});