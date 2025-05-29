import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import CallLogForm from '../../components/agent/CallLogForm';
import RecentCalls from '../../components/agent/RecentCalls';

const AgentDashboard = () => {
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerHistory, setCustomerHistory] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const loadRecentCalls = async () => {
      try {
        setLoading(true);
        const res = await api.getAgentCalls();
        setRecentCalls(res.data);
      } catch (err) {
        console.error('Failed to load recent calls', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecentCalls();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      history.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleCallSubmit = async (callData) => {
    try {
      setLoading(true);
      const res = await api.createCall(callData);
      setRecentCalls([res.data, ...recentCalls]);
      setCustomerHistory(null);
      return { success: true };
    } catch (err) {
      console.error('Failed to create call', err);
      return { success: false, message: err.response?.data?.message || 'Failed to log call' };
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerHistory = async (contactNumber) => {
    if (!contactNumber || contactNumber.length < 3) {
      setCustomerHistory(null);
      return;
    }
    
    try {
      const res = await api.getCalls({ 
        customerContact: contactNumber,
        limit: 5,
        sort: '-createdAt'
      });
      
      if (res.data.length > 0) {
        setCustomerHistory({
          contact: contactNumber,
          calls: res.data
        });
      } else {
        setCustomerHistory(null);
      }
    } catch (err) {
      console.error('Failed to fetch customer history', err);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo-container">
          <img src="/images/gadaa-logo.png" alt="Gadaa Bank Logo" className="logo" />
          <h1>Call Agent Dashboard</h1>
        </div>
        <nav className="user-nav">
          <div className="user-profile">
            <span>{user?.name || 'Agent'}</span>
            <div className="profile-dropdown">
              <button onClick={() => history.push('/profile')}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="agent-main">
        <CallLogForm 
          onSubmit={handleCallSubmit} 
          onContactChange={fetchCustomerHistory}
          customerHistory={customerHistory}
          loading={loading}
        />
        
        <RecentCalls calls={recentCalls} loading={loading} />
      </main>
    </div>
  );
};

export default AgentDashboard;