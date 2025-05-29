import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { login } from '../../services/authService';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: theme.palette.grey[100]
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: 400,
    width: '100%'
  },
  form: {
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);
      
      // Redirect based on role
      switch(user.role) {
        case 'admin':
          history.push('/admin');
          break;
        case 'agent':
          history.push('/agent');
          break;
        case 'backoffice':
          history.push('/backoffice');
          break;
        case 'supervisor':
          history.push('/supervisor');
          break;
        case 'finance':
          history.push('/finance');
          break;
        case 'shareholder':
          history.push('/shareholder');
          break;
        case 'digital':
          history.push('/digital');
          break;
        default:
          history.push('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Box textAlign="center" mb={3}>
            <img 
              src="/images/gadaa-logo.png" 
              alt="Gadaa Bank" 
              style={{ height: 50, marginBottom: 16 }} 
            />
            <Typography component="h1" variant="h5">
              Contact Center Login
            </Typography>
          </Box>

          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;