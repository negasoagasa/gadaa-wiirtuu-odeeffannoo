class NotificationSystem {
  constructor() {
    this.audio = new Audio('notification.wav');
    this.audio.volume = 0.5;
    this.notificationContainer = document.getElementById('notificationContainer');
    this.setupEventListeners();
    this.checkInterval = 30000; // 30 seconds
    this.init();
  }

  init() {
    this.checkForNewItems();
    setInterval(() => this.checkForNewItems(), this.checkInterval);
    
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.checkForNewItems();
    });
  }

  async checkForNewItems() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const notifications = await response.json();
        notifications.forEach(notification => {
          this.showNotification(notification.message);
        });
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">🔔</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    this.notificationContainer.appendChild(notification);
    this.playSound();

    // Auto-remove after 10 seconds
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 500);
    }, 10000);

    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 500);
    });
  }

  playSound() {
    this.audio.currentTime = 0;
    this.audio.play().catch(e => console.log('Audio play failed:', e));
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new NotificationSystem();
});