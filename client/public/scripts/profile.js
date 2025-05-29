document.addEventListener('DOMContentLoaded', async function() {
  // Check authentication
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user) {
    window.location.href = 'index.html';
    return;
  }

  // Load profile data
  await loadProfile(user._id);
  
  // Setup event listeners
  setupEventListeners();
});

async function loadProfile(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load profile');
    }

    const user = await response.json();
    renderProfile(user);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load profile');
  }
}

function renderProfile(user) {
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email || 'Not provided';
  document.getElementById('profilePhone').textContent = user.phone || 'Not provided';
  document.getElementById('profileRole').textContent = formatRole(user.role);
  document.getElementById('profileDepartment').textContent = user.department || 'Not assigned';

  if (user.profile) {
    if (user.profile.position) {
      document.getElementById('profilePosition').textContent = user.profile.position;
    }
    if (user.profile.hireDate) {
      document.getElementById('profileHireDate').textContent = new Date(user.profile.hireDate).toLocaleDateString();
    }
  }
}

function setupEventListeners() {
  // Edit profile button
  document.getElementById('editProfileBtn').addEventListener('click', function() {
    document.getElementById('profileView').style.display = 'none';
    document.getElementById('editProfileView').style.display = 'block';
    populateEditForm();
  });

  // Save profile button
  document.getElementById('saveProfileBtn').addEventListener('click', async function() {
    await saveProfile();
  });

  // Cancel edit button
  document.getElementById('cancelEditBtn').addEventListener('click', function() {
    document.getElementById('editProfileView').style.display = 'none';
    document.getElementById('profileView').style.display = 'block';
  });
}

function populateEditForm() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  document.getElementById('editName').value = user.name;
  document.getElementById('editEmail').value = user.email || '';
  document.getElementById('editPhone').value = user.phone || '';
  
  if (user.profile) {
    document.getElementById('editPosition').value = user.profile.position || '';
    document.getElementById('editHireDate').value = user.profile.hireDate || '';
  }
}

async function saveProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const profileData = {
    name: document.getElementById('editName').value,
    email: document.getElementById('editEmail').value,
    phone: document.getElementById('editPhone').value,
    profile: {
      position: document.getElementById('editPosition').value,
      hireDate: document.getElementById('editHireDate').value
    }
  };

  try {
    const response = await fetch(`/api/users/${user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser = await response.json();
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update UI
    renderProfile(updatedUser);
    document.getElementById('editProfileView').style.display = 'none';
    document.getElementById('profileView').style.display = 'block';
    
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}

function formatRole(role) {
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
}