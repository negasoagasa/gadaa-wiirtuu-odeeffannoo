import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, TextField, Button, Avatar } from '@material-ui/core';
import authService from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    hireDate: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          position: userData.profile?.position || '',
          hireDate: userData.profile?.hireDate || '',
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await authService.updateProfile({
        ...formData,
        profile: {
          position: formData.position,
          hireDate: formData.hireDate,
        },
      });
      setUser(updatedUser);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper style={{ padding: '20px', textAlign: 'center' }}>
          <Avatar
            style={{ width: '150px', height: '150px', margin: '0 auto 20px' }}
            src={user?.profileImage}
          />
          <Typography variant="h5">{user?.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {user?.role} - {user?.department}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper style={{ padding: '20px' }}>
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Hire Date"
                name="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginRight: '10px' }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Name:</strong> {user?.name}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Phone:</strong> {user?.phone || 'Not provided'}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Position:</strong> {user?.profile?.position || 'Not provided'}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Hire Date:</strong> {user?.profile?.hireDate || 'Not provided'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;