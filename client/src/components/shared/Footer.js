import React from 'react';
import { Typography, Box } from '@material-ui/core';

const Footer = () => {
  return (
    <Box mt={5} py={3} textAlign="center" bgcolor="primary.main" color="white">
      <Typography variant="body2">
        © {new Date().getFullYear()} Gadaa Bank Contact Center. All rights reserved.
      </Typography>
      <Typography variant="caption" display="block">
        Version 1.0.0
      </Typography>
    </Box>
  );
};

export default Footer;