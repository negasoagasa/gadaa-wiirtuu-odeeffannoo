document.addEventListener('DOMContentLoaded', async function() {
  // Check authentication
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user) {
    window.location.href = 'index.html';
    return;
  }
  
  document.getElementById('currentAgentName').textContent = user.name;
  
  // Load recent calls
  await loadRecentCalls();
  
  // Setup event listeners
  setupEventListeners();
});

async function loadRecentCalls() {
  try {
    const response = await fetch('/api/calls/agent', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load calls');
    }
    
    const calls = await response.json();
    renderRecentCalls(calls);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load recent calls');
  }
}

function renderRecentCalls(calls) {
  const tableBody = document.querySelector('#recentCallsTable tbody');
  tableBody.innerHTML = '';
  
  calls.forEach(call => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatTime(call.createdAt)}</td>
      <td>${call.customerContact}</td>
      <td>${call.item}</td>
      <td>${call.category || 'N/A'}</td>
      <td class="status-${call.status}">${call.status}</td>
      <td><button class="btn-view" data-id="${call._id}">View</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function setupEventListeners() {
  // Form submission
  document.getElementById('callLogForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
      customerContact: document.getElementById('customerContact').value.trim(),
      item: document.getElementById('callItem').value,
      category: document.getElementById('callCategory').value,
      description: document.getElementById('callDescription').value.trim(),
      status: document.getElementById('callStatus').value,
      escalatedTo: document.getElementById('escalationDepartment').value || null
    };
    
    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to log call');
      }
      
      // Refresh calls
      await loadRecentCalls();
      this.reset();
      alert('Call logged successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  });
  
  // Other event listeners...
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}