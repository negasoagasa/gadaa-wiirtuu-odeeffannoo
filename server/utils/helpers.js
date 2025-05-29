const crypto = require('crypto');

// Generate random token
exports.generateRandomToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Format date
exports.formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Format time
exports.formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format role
exports.formatRole = (role) => {
  const roleMap = {
    'admin': 'Administrator',
    'agent': 'Call Agent',
    'backoffice': 'Back Office',
    'supervisor': 'Supervisor',
    'finance': 'Finance',
    'shareholder': 'Shareholder',
    'digital': 'Digital'
  };
  return roleMap[role] || role;
};