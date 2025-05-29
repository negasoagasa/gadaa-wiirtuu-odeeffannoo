document.addEventListener('DOMContentLoaded', async function() {
  // Check authentication
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user || user.role !== 'supervisor') {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('currentSupervisorName').textContent = user.name;
  
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
    document.getElementById('supervisorTotalCalls').textContent = stats.totalCalls || 0;
    document.getElementById('supervisorEscalatedCalls').textContent = stats.escalatedCalls || 0;
    document.getElementById('supervisorSolvedCalls').textContent = stats.solvedCalls || 0;
    document.getElementById('supervisorPendingCalls').textContent = stats.pendingCalls || 0;

    // Load recent calls
    await loadRecentCalls();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load dashboard data');
  }
}

async function loadRecentCalls() {
  try {
    const response = await fetch('/api/calls?limit=5', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load recent calls');
    }

    const calls = await response.json();
    renderCalls('#supervisorRecentCallsTable', calls);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load recent calls');
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
      <td class="status-${call.status}">${call.status}</td>
      <td>
        <button class="btn-view" data-id="${call._id}">View</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function setupEventListeners() {
  // Navigation
  document.getElementById('supervisorDashboardLink').addEventListener('click', function(e) {
    e.preventDefault();
    showView('supervisorDashboardView');
    loadDashboardData();
  });

  document.getElementById('supervisorAllCallsLink').addEventListener('click', function(e) {
    e.preventDefault();
    showView('supervisorAllCallsView');
    loadAllCalls();
  });

  document.getElementById('supervisorAgentsLink').addEventListener('click', function(e) {
    e.preventDefault();
    showView('supervisorAgentsView');
    loadAgentPerformance();
  });

  // Logout
  document.getElementById('supervisorLogoutLink').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });

  // Profile
  document.getElementById('supervisorProfileLink').addEventListener('click', function(e) {
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