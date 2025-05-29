const Call = require('../models/Call');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all calls
// @route   GET /api/calls
// @access  Private
exports.getCalls = asyncHandler(async (req, res, next) => {
  const { status, escalatedTo, agent, customerContact, limit, sort } = req.query;
  
  let query = {};
  
  if (status) query.status = status;
  if (escalatedTo) query.escalatedTo = escalatedTo;
  if (agent) query.agent = agent;
  if (customerContact) query.customerContact = { $regex: customerContact, $options: 'i' };
  
  let calls = Call.find(query);
  
  if (sort) {
    calls = calls.sort(sort);
  } else {
    calls = calls.sort('-createdAt');
  }
  
  if (limit) {
    calls = calls.limit(parseInt(limit));
  }
  
  calls = await calls.populate('agent', 'name username role');
  
  res.status(200).json({
    success: true,
    count: calls.length,
    data: calls
  });
});

// @desc    Get single call
// @route   GET /api/calls/:id
// @access  Private
exports.getCall = asyncHandler(async (req, res, next) => {
  const call = await Call.findById(req.params.id).populate('agent', 'name username role');
  
  if (!call) {
    return next(new ErrorResponse(`Call not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: call
  });
});

// @desc    Create new call
// @route   POST /api/calls
// @access  Private (Agent)
exports.createCall = asyncHandler(async (req, res, next) => {
  // Add agent to req.body
  req.body.agent = req.user.id;
  req.body.agentName = req.user.name;
  
  const call = await Call.create(req.body);
  
  res.status(201).json({
    success: true,
    data: call
  });
});

// @desc    Update call
// @route   PUT /api/calls/:id
// @access  Private
exports.updateCall = asyncHandler(async (req, res, next) => {
  let call = await Call.findById(req.params.id);
  
  if (!call) {
    return next(new ErrorResponse(`Call not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is call agent or admin
  if (call.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this call`, 401));
  }
  
  call = await Call.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: call
  });
});

// @desc    Respond to call
// @route   POST /api/calls/:id/respond
// @access  Private
exports.respondToCall = asyncHandler(async (req, res, next) => {
  let call = await Call.findById(req.params.id);
  
  if (!call) {
    return next(new ErrorResponse(`Call not found with id of ${req.params.id}`, 404));
  }
  
  // Add response
  const response = {
    user: req.user.id,
    userName: req.user.name,
    department: req.user.role,
    text: req.body.text,
    forBackoffice: ['backoffice', 'finance', 'digital', 'shareholder'].includes(req.user.role)
  };
  
  call.responses.push(response);
  
  // Update status if provided
  if (req.body.status) {
    call.status = req.body.status;
    
    if (req.body.status === 'escalated' && req.body.escalatedTo) {
      call.escalatedTo = req.body.escalatedTo;
      call.escalationPath.push({
        from: req.user.role,
        to: req.body.escalatedTo
      });
    }
  }
  
  await call.save();
  
  res.status(200).json({
    success: true,
    data: call
  });
});

// @desc    Get dashboard stats
// @route   GET /api/calls/stats/dashboard
// @access  Private (Admin/Supervisor)
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const stats = {};
  
  // For admin dashboard
  if (req.query.role === 'admin') {
    const callsToday = await Call.countDocuments({ createdAt: { $gte: today } });
    const escalatedToday = await Call.countDocuments({ 
      createdAt: { $gte: today },
      status: 'escalated'
    });
    const solvedToday = await Call.countDocuments({ 
      createdAt: { $gte: today },
      status: 'solved'
    });
    const pendingToday = await Call.countDocuments({ 
      createdAt: { $gte: today },
      status: 'pending'
    });
    const abandonedToday = await Call.countDocuments({ 
      createdAt: { $gte: today },
      status: 'abandoned'
    });
    
    stats.totalCalls = callsToday;
    stats.escalatedCalls = escalatedToday;
    stats.solvedCalls = solvedToday;
    stats.pendingCalls = pendingToday;
    stats.abandonedCalls = abandonedToday;
  }
  
  // For backoffice/department dashboards
  if (['backoffice', 'finance', 'digital', 'shareholder'].includes(req.query.role)) {
    const escalatedCalls = await Call.countDocuments({ 
      status: 'escalated',
      escalatedTo: req.query.role
    });
    const pendingCalls = await Call.countDocuments({ 
      status: 'pending',
      escalatedTo: req.query.role
    });
    const solvedToday = await Call.countDocuments({ 
      createdAt: { $gte: today },
      status: 'solved',
      escalatedTo: req.query.role
    });
    
    stats.totalEscalated = escalatedCalls;
    stats.pendingResponse = pendingCalls;
    stats.solvedToday = solvedToday;
  }
  
  res.status(200).json({
    success: true,
    data: stats
  });
});