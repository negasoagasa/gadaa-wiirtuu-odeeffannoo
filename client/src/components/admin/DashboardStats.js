import React from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';

const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    { title: 'Total Calls Today', value: stats.totalCalls, color: 'primary' },
    { title: 'Escalated Calls', value: stats.escalatedCalls, color: 'secondary' },
    { title: 'Solved Calls', value: stats.solvedCalls, color: 'success' },
    { title: 'Pending Calls', value: stats.pendingCalls, color: 'warning' },
    { title: 'Abandoned Calls', value: stats.abandonedCalls, color: 'error' }
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {stat.title}
              </Typography>
              <Typography variant="h5" component="h2" color={stat.color}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;