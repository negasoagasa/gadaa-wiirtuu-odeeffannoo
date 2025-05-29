import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import DashboardStats from '../../components/admin/DashboardStats';
import RecentActivity from '../../components/admin/RecentActivity';
import UserManagement from '../../components/admin/UserManagement';
import Reports from '../../components/admin/Reports';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [recentCalls, setRecentCalls] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, callsRes] = await Promise.all([
          api.getDashboardStats('admin'),
          api.getCalls({ limit: 5, sort: '-createdAt' })
        ]);
        
        setStats(statsRes.data);
        setRecentCalls(callsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeView === 'dashboard') {
      loadDashboardData();
    }
  }, [activeView]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await api.getUsers();
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to load users', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeView === 'users') {
      loadUsers();
    }
  }, [activeView]);

  const handleLogout = async () => {
    try {
      await api.logout();
      history.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo-container">
          <img src="/images/gadaa-logo.png" alt="Gadaa Bank Logo" className="logo" />
          <h1>Admin Dashboard</h1>
        </div>
        <nav className="user-nav">
          <div className="user-profile">
            <span>{user?.name || 'Admin User'}</span>
            <div className="profile-dropdown">
              <button onClick={() => history.push('/profile')}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </nav>
      </header>
      
      <aside className="sidebar">
        <ul className="side-nav">
          <li className={`side-nav__item ${activeView === 'dashboard' ? 'side-nav__item--active' : ''}`}>
            <button 
              className="side-nav__link"
              onClick={() => setActiveView('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li className={`side-nav__item ${activeView === 'users' ? 'side-nav__item--active' : ''}`}>
            <button 
              className="side-nav__link"
              onClick={() => setActiveView('users')}
            >
              User Management
            </button>
          </li>
          <li className={`side-nav__item ${activeView === 'reports' ? 'side-nav__item--active' : ''}`}>
            <button 
              className="side-nav__link"
              onClick={() => setActiveView('reports')}
            >
              Reports
            </button>
          </li>
        </ul>
      </aside>
      
      <main className="main-content">
        {loading && <div className="loading">Loading...</div>}
        
        {activeView === 'dashboard' && (
          <>
            <DashboardStats stats={stats} />
            <RecentActivity calls={recentCalls} />
          </>
        )}
        
        {activeView === 'users' && (
          <UserManagement 
            users={users} 
            onUserCreated={(user) => setUsers([...users, user])}
            onUserUpdated={(updatedUser) => 
              setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u))
            }
            onUserDeleted={(userId) => 
              setUsers(users.filter(u => u._id !== userId))
            }
          />
        )}
        
        {activeView === 'reports' && <Reports />}
      </main>
    </div>
  );
};

export default AdminDashboard;