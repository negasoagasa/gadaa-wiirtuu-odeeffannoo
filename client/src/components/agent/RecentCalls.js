import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import { formatTime } from '../../../utils/helpers';

const RecentCalls = ({ calls }) => {
  if (!calls || calls.length === 0) {
    return <p>No recent calls</p>;
  }

  return (
    <Paper>
      <h2>Recent Calls</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call._id}>
              <TableCell>{formatTime(call.createdAt)}</TableCell>
              <TableCell>{call.customerContact}</TableCell>
              <TableCell>{call.item}</TableCell>
              <TableCell>{call.category}</TableCell>
              <TableCell style={{ color: getStatusColor(call.status) }}>
                {call.status}
              </TableCell>
              <TableCell>
                <Button 
                  color="primary"
                  onClick={() => {/* View call details */}}
                >
                  View
                </Button>
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

export default RecentCalls;