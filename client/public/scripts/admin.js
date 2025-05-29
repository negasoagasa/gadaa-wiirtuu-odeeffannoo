document.addEventListener('DOMContentLoaded', async function() {
  // Check authentication
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user || user.role !== 'admin') {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('currentUserName').textContent = user.name;
  
  // Load dashboard data
  await loadDashboardData();
  await loadUsers();
  
  // Setup event listeners
  setupEventListeners();
});

async function loadDashboardData() {
  try {
    const [statsRes, callsRes] = await Promise.all([
      fetch('/api/calls/stats/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }),
      fetch('/api/calls?limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    ]);

    if (!statsRes.ok || !callsRes.ok) {
      throw new Error('Failed to load dashboard data');
    }

    const stats = await statsRes.json();
    const calls = await callsRes.json();

    // Update dashboard stats
    document.getElementById('totalCalls').textContent = stats.totalCalls || 0;
    document.getElementById('escalatedCalls').textContent = stats.escalatedCalls || 0;
    document.getElementById('solvedCalls').textContent = stats.solvedCalls || 0;
    document.getElementById('pendingCalls').textContent = stats.pendingCalls || 0;
    document.getElementById('abandonedCalls').textContent = stats.abandonedCalls || 0;

    // Update recent activity
    const tableBody = document.querySelector('#recentActivityTable tbody');
    tableBody.innerHTML = '';
    
    calls.forEach(call => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatTime(call.createdAt)}</td>
        <td>${call.agentName || 'System'}</td>
        <td>${call.customerContact}</td>
        <td>${call.item}</td>
        <td class="status-${call.status}">${call.status}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load dashboard data');
  }
}

async function loadUsers() {
  try {
    const response = await fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load users');
    }

    const users = await response.json();
    renderUsers(users);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load users');
  }
}

function renderUsers(users) {
  const tableBody = document.getElementById('userTableBody');
  tableBody.innerHTML = '';
  
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user._id}</td>
      <td>${user.name}</td>
      <td>${user.username}</td>
      <td>${formatRole(user.role)}</td>
      <td>${user.department || ''}</td>
      <td>${user.email || ''}</td>
      <td>${user.phone || ''}</td>
      <td>
        <button class="btn-edit" data-id="${user._id}">Edit</button>
        <button class="btn-delete" data-id="${user._id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function setupEventListeners() {
  // Navigation
  document.getElementById('dashboardLink').addEventListener('click', function(e) {
    e.preventDefault();
    showView('dashboardView');
    loadDashboardData();
  });

  document.getElementById('userManagementLink').addEventListener('click', function(e) {
    e.preventDefault();
    showView('userManagementView');
    loadUsers();
  });

  document.getElementById('reportsLink').addEventListener('click', function(e) {
    e.preventDefault();
    showView('reportsView');
  });

  // Logout
  document.getElementById('logoutLink').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });

  // Profile
  document.getElementById('profileLink').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'profile.html';
  });
}

function showView(viewId) {
  document.querySelectorAll('.main-content > div').forEach(view => {
    view.style.display = 'none';
  });
  document.getElementById(viewId).style.display = 'block';
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRole(role) {
  const roleMap = {
    'admin': 'Admin',
    'agent': 'Call Agent',
    'backoffice': 'Back Office',
    'supervisor': 'Supervisor',
    'finance': 'Finance',
    'shareholder': 'Shareholder',
    'digital': 'Digital'
  };
  return roleMap[role] || role;
}