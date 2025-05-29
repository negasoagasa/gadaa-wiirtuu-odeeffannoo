import React from 'react';
import { CircularProgress, Box } from '@material-ui/core';

const LoadingSpinner = ({ size = 40, color = 'primary' }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={4}>
      <CircularProgress size={size} color={color} />
    </Box>
  );
};

export default LoadingSpinner;