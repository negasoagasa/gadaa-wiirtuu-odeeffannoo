const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  agent: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agentName: { type: String, required: true },
  customerContact: { type: String, required: true },
  item: { 
    type: String,
    required: true,
    enum: ['Share Holders', 'Branch', 'Account', 'Digital Banking', 'Vacancy', 'Other', 'Incomplete', 'Credit']
  },
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['new', 'pending', 'solved', 'escalated', 'abandoned'],
    default: 'new'
  },
  escalatedTo: {
    type: String,
    enum: ['backoffice', 'finance', 'digital', 'shareholder', null],
    default: null
  },
  escalationPath: [{
    from: String,
    to: String,
    timestamp: { type: Date, default: Date.now }
  }],
  responses: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    department: String,
    text: String,
    forBackoffice: Boolean,
    timestamp: { type: Date, default: Date.now }
  }],
  isBackofficeCall: { type: Boolean, default: false },
  pendingResponse: { type: Boolean, default: false },
  notificationShown: { type: Boolean, default: false }
}, { timestamps: true });

// Indexes for faster queries
callSchema.index({ agent: 1, status: 1 });
callSchema.index({ status: 1, escalatedTo: 1 });
callSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Call', callSchema);