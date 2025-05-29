import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import callService from '../../services/callService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RecentCalls from '../../components/common/RecentCalls';

const BackofficeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, callsData] = await Promise.all([
          callService.getDashboardStats(),
          callService.getCalls({ status: 'escalated', limit: 5 })
        ]);
        setStats(statsData);
        setRecentCalls(callsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Total Escalated Calls
          </Typography>
          <Typography variant="h4">{stats?.totalEscalated || 0}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Calls Pending Response
          </Typography>
          <Typography variant="h4">{stats?.pendingResponse || 0}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Solved Today
          </Typography>
          <Typography variant="h4">{stats?.solvedToday || 0}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <RecentCalls calls={recentCalls} title="Recent Escalated Calls" />
      </Grid>
    </Grid>
  );
};

export default BackofficeDashboard;