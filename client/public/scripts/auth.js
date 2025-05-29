document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect based on role
    switch(data.user.role) {
      case 'admin':
        window.location.href = 'admin.html';
        break;
      case 'agent':
        window.location.href = 'agent.html';
        break;
      case 'backoffice':
        window.location.href = 'backoffice.html';
        break;
      case 'supervisor':
        window.location.href = 'supervisor.html';
        break;
      case 'finance':
        window.location.href = 'finance.html';
        break;
      case 'shareholder':
        window.location.href = 'shareholder.html';
        break;
      case 'digital':
        window.location.href = 'digital.html';
        break;
      default:
        window.location.href = 'agent.html';
    }
  } catch (error) {
    document.getElementById('loginError').textContent = error.message;
  }
});