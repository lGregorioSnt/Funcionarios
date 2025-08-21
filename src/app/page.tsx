'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ----- INÍCIO DA CORREÇÃO -----
import { 
  Box, Button, Card, CardContent, TextField, Typography, Container, 
  createTheme, ThemeProvider, CssBaseline 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// ----- FIM DA CORREÇÃO -----


// 1. CRIAÇÃO DE UM TEMA CUSTOMIZADO COM A PALETA VERMELHA
const theme = createTheme({
  palette: {
    primary: {
      main: '#e53935', // Um tom de vermelho forte
    },
    background: {
      default: '#121212', // Fundo escuro
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  // Opcional: Estilizar os campos de texto para combinar com o tema escuro
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#e53935', // Cor do label quando focado
          },
          '& .MuiOutlinedInput-root': {
            color: '#ffffff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)', // Borda padrão
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)', // Borda ao passar o mouse
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e53935', // Borda quando focado
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)', // Cor do label padrão
          },
        },
      },
    },
  },
});


export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('authToken', token);
        router.push('/dashboard');
      } else {
        setError('Email ou senha inválidos.');
      }
    } catch (err) {
      setError('Falha ao conectar com o servidor.');
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
            <LockOutlinedIcon sx={{ mb: 1, fontSize: '2rem' }} />
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Endereço de E-mail"
                name="email"
                autoComplete="email"
                autoFocus
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
              />
              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '8px' }}
              >
                Entrar
              </Button>
              <Box textAlign="center">
                <Link href="/register" passHref>
                  <Typography
                    variant="body2"
                    component="a"
                    sx={{ textDecoration: 'none', color: 'primary.main' }}
                  >
                    Não tem uma conta? Registre-se
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