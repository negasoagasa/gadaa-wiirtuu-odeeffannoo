import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './views/auth/Login';
import AdminDashboard from './views/admin/Dashboard';
import AgentDashboard from './views/agent/Dashboard';
import BackofficeDashboard from './views/backoffice/Dashboard';
import DigitalDashboard from './views/digital/Dashboard';
import FinanceDashboard from './views/finance/Dashboard';
import ShareholderDashboard from './views/shareholder/Dashboard';
import SupervisorDashboard from './views/supervisor/Dashboard';
import Profile from './views/Profile';
import Layout from './components/Layout';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Layout>
            <Switch>
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/admin" role="admin" component={AdminDashboard} />
              <PrivateRoute exact path="/agent" role="agent" component={AgentDashboard} />
              <PrivateRoute exact path="/backoffice" role="backoffice" component={BackofficeDashboard} />
              <PrivateRoute exact path="/digital" role="digital" component={DigitalDashboard} />
              <PrivateRoute exact path="/finance" role="finance" component={FinanceDashboard} />
              <PrivateRoute exact path="/shareholder" role="shareholder" component={ShareholderDashboard} />
              <PrivateRoute exact path="/supervisor" role="supervisor" component={SupervisorDashboard} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
            </Switch>
          </Layout>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;