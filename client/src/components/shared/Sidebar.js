import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = ({ open, onClose }) => {
  const history = useHistory();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = {
    admin: [
      { text: 'Dashboard', path: '/admin', icon: 'dashboard' },
      { text: 'User Management', path: '/admin/users', icon: 'people' },
      { text: 'Reports', path: '/admin/reports', icon: 'assessment' },
    ],
    agent: [
      { text: 'Call Log', path: '/agent', icon: 'call' },
      { text: 'Recent Calls', path: '/agent/calls', icon: 'history' },
    ],
    backoffice: [
      { text: 'Dashboard', path: '/backoffice', icon: 'dashboard' },
      { text: 'Escalated Calls', path: '/backoffice/escalated', icon: 'priority_high' },
      { text: 'Pending Calls', path: '/backoffice/pending', icon: 'pending' },
    ],
    // Add other roles similarly
  };

  const items = navItems[user?.role] || [];

  return (
    <Drawer open={open} onClose={onClose}>
      <div style={{ width: 250 }}>
        <List>
          {items.map((item) => (
            <ListItem 
              button 
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => {
                history.push(item.path);
                onClose();
              }}
            >
              <ListItemIcon>
                <span className="material-icons">{item.icon}</span>
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </div>
    </Drawer>
  );
};

export default Sidebar;