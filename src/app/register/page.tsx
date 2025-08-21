'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box, Button, Card, CardContent, TextField, Typography, Container,
  Alert, createTheme, ThemeProvider, CssBaseline
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

// 1. TEMA CUSTOMIZADO COM A PALETA VERMELHA
const theme = createTheme({
  palette: {
    primary: {
      main: '#e53935',
    },
    background: {
      default: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#e53935',
          },
          '& .MuiOutlinedInput-root': {
            color: '#ffffff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e53935',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
    },
  },
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('authToken', token);
        setSuccess('Usuário registrado com sucesso! Entrando...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Falha ao registrar.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #212121 30%, #424242 90%)',
        }}
      >
        <Container component="main" maxWidth="xs">
          <Card
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <PersonAddOutlinedIcon sx={{ mb: 1, fontSize: '2rem' }} />
            <Typography component="h1" variant="h5">
              Criar Conta
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField margin="normal" required fullWidth id="email" label="Endereço de E-mail" name="email" autoComplete="email" autoFocus />
              <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" />
              <TextField margin="normal" required fullWidth name="confirmPassword" label="Confirmar Senha" type="password" id="confirmPassword" />
              
              {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{success}</Alert>}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '8px' }}
              >
                Registrar
              </Button>
              <Box textAlign="center">
                <Link href="/login" passHref>
                  <Typography
                    variant="body2"
                    component="a"
                    sx={{ textDecoration: 'none', color: 'primary.main' }}
                  >
                    Já tem uma conta? Faça login
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}