import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, CssBaseline, Avatar, Box, Grid, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError(!email);
    setPasswordError(!password);

    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      // Handle successful login (e.g., save token, redirect)
      console.log(response.data);
      navigate('/home'); // Redireciona para a página home
    } catch (error) {
      // Handle login error
      toast.error('E-mail ou senha inválidos');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? 'E-mail é obrigatório' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? 'Senha é obrigatória' : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              ENTRAR
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
};

export default Login;