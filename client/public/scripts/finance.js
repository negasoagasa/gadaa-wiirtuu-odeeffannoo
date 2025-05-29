document.addEventListener('DOMContentLoaded', async function() {
  // Check authentication
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user || user.role !== 'finance') {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('currentFinanceName').textContent = user.name;
  
  // Load dashboard data
  await loadDashboardData();
  
  // Setup event listeners
  setupEventListeners();
});

async function loadDashboardData() {
  try {
    const response = await fetch('/api/calls/stats/dashboard', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load dashboard data');
    }

    const stats = await response.json();

    // Update dashboard stats
    document.getElementById('financeTotalEscalated').textContent = stats.escalatedCalls || 0;
    document.getElementById('financePendingResponse').textContent = stats.pendingCalls || 0;
    document.getElementById('financeSolvedToday').textContent = stats.solvedCalls || 0;

    // Load recent escalated calls
    await loadRecentEscalatedCalls();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load dashboard data');
  }
}

async function loadRecentEscalatedCalls() {
  try {
    const response = await fetch('/api/calls/escalated', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load escalated calls');
    }

    const calls = await response.json();
    renderCalls('#financeRecentEscalatedTable', calls.slice(0, 5));
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load escalated calls');
  }
}

function renderCalls(tableSelector, calls) {
  const tableBody = document.querySelector(`${tableSelector} tbody`);
  tableBody.innerHTML = '';
  
  calls.forEach(call => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatTime(call.createdAt)}</td>
      <td>${call.agentName}</td>
      <td>${call.customerContact}</td>
      <td>${call.item}</td>
      <td>${call.category || 'N/A'}</td>
      <td class="status-${call.status}">${call.status}</td>
      <td>
        <button class="btn-view" data-id="${call._id}">View</button>
        <button class="btn-respond" data-id="${call._id}">Respond</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function setupEventListeners() {
  // Navigation
  document.getElementById('financeDashboardLink').addEventListener('click', function(e) {
    e.preventDefault();
    showView('financeDashboardView');
    loadDashboardData();
  });

  document.getElementById('financeEscalatedLink').addEventListener('click', function(e) {
    e.preventDefault();
    showView('financeEscalatedView');
    loadEscalatedCalls();
  });

  // Logout
  document.getElementById('financeLogoutLink').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });

  // Profile
  document.getElementById('financeProfileLink').addEventListener('click', function(e) {
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