import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import { formatTime } from '../../../utils/helpers';

const RecentActivity = ({ calls }) => {
  if (!calls || calls.length === 0) {
    return <p>No recent activity</p>;
  }

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Agent</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call._id}>
              <TableCell>{formatTime(call.createdAt)}</TableCell>
              <TableCell>{call.agentName}</TableCell>
              <TableCell>{call.customerContact}</TableCell>
              <TableCell>{call.item}</TableCell>
              <TableCell style={{ color: getStatusColor(call.status) }}>
                {call.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'new': return '#17a2b8';
    case 'pending': return '#ffc107';
    case 'solved': return '#28a745';
    case 'escalated': return '#DA121A';
    case 'abandoned': return '#dc3545';
    default: return '#333';
  }
};

export default RecentActivity;