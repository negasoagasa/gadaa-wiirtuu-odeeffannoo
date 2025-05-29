import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { formatRole } from '../../../utils/helpers';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.getUsers();
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Failed to load users', error);
      }
    };
    
    loadUsers();
  }, []);

  useEffect(() => {
    let result = users;
    
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
    
    setFilteredUsers(result);
  }, [users, roleFilter, searchTerm]);

  const handleAddUser = () => {
    setCurrentUser({
      name: '',
      username: '',
      password: '',
      role: 'agent',
      department: '',
      email: '',
      phone: ''
    });
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const handleSaveUser = async () => {
    try {
      if (currentUser._id) {
        // Update existing user
        const response = await api.updateUser(currentUser._id, currentUser);
        setUsers(users.map(user => user._id === currentUser._id ? response.data : user));
      } else {
        // Create new user
        const response = await api.createUser(currentUser);
        setUsers([...users, response.data]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to save user', error);
    }
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="agent">Call Agent</MenuItem>
            <MenuItem value="backoffice">Back Office</MenuItem>
            <MenuItem value="supervisor">Supervisor</MenuItem>
            <MenuItem value="finance">Finance</MenuItem>
            <MenuItem value="shareholder">Shareholder</MenuItem>
            <MenuItem value="digital">Digital</MenuItem>
          </Select>
          
          <TextField
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAddUser}
        >
          Add New User
        </Button>
      </div>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{formatRole(user.role)}</TableCell>
              <TableCell>{user.department}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Button 
                  color="primary"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </Button>
                <Button 
                  color="secondary"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{currentUser?._id ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          {/* User form fields would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserManagement;