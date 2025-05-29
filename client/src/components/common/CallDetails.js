import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@material-ui/core';
import { formatTime, formatDate } from '../../../utils/helpers';

const CallDetails = ({ call, open, onClose }) => {
  if (!call) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Call Details</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Agent:</strong> {call.agentName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Customer:</strong> {call.customerContact}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Date/Time:</strong> {formatDate(call.createdAt)} at {formatTime(call.createdAt)}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Item:</strong> {call.item}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Category:</strong> {call.category || 'N/A'}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Status:</strong> <span style={{ color: getStatusColor(call.status) }}>{call.status}</span>
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Description:</strong> {call.description}
        </Typography>

        {call.responses?.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Responses
            </Typography>
            {call.responses.map((response, index) => (
              <div key={index} style={{ marginBottom: '15px', padding: '10px', borderLeft: '3px solid #DA121A' }}>
                <Typography variant="subtitle1">
                  <strong>{response.userName}</strong> ({response.department})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatTime(response.timestamp)}
                </Typography>
                <Typography variant="body1">
                  {response.text}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
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

export default CallDetails;