import React, { useState } from 'react';
import { Button, Select, MenuItem, TextField, Grid, Paper, Typography } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { format } from 'date-fns';

const Reports = () => {
  const [period, setPeriod] = useState('daily');
  const [date, setDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);

  const handleGenerateReport = async () => {
    try {
      // Call API to generate report
      const response = await api.generateReport({ period, date: format(date, 'yyyy-MM-dd') });
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to generate report', error);
    }
  };

  const handleExport = async () => {
    try {
      // Call API to export report
      await api.exportReport({ period, date: format(date, 'yyyy-MM-dd') });
    } catch (error) {
      console.error('Failed to export report', error);
    }
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Generate Report
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Select
            fullWidth
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <DatePicker
            fullWidth
            value={date}
            onChange={setDate}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleGenerateReport}
            fullWidth
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>

      {reportData && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>
            {reportData.title}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Typography>Total Calls: {reportData.totalCalls}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography>Solved: {reportData.solvedCalls}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography>Escalated: {reportData.escalatedCalls}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography>Pending: {reportData.pendingCalls}</Typography>
            </Grid>
          </Grid>
          
          <Button 
            variant="contained" 
            color="secondary"
            onClick={handleExport}
            style={{ marginTop: '20px' }}
          >
            Export to CSV
          </Button>
        </div>
      )}
    </Paper>
  );
};

export default Reports;