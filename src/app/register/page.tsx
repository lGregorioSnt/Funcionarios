'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box, Button, Card, TextField, Typography, Container,
  Alert, createTheme, ThemeProvider, CssBaseline, CircularProgress
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

const theme = createTheme({
  palette: {
    primary: { main: '#e53935' },
    background: { default: '#121212' },
    text: { primary: '#ffffff', secondary: '#b0bec5' },
    success: { main: '#66bb6a' },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': { color: '#e53935' },
          '& .MuiOutlinedInput-root': {
            color: '#ffffff',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#e53935' },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
        },
      },
    },
  },
});

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // NOVO ESTADO para controlar a exibição da tela
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // LÓGICA ATUALIZADA: não faz mais login, apenas mostra sucesso
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Falha ao registrar.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
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
            {isSubmitted ? (
              // NOVA TELA DE CONFIRMAÇÃO
              <>
                <MarkEmailReadOutlinedIcon sx={{ fontSize: '3rem', color: 'success.main' }} />
                <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 1 }}>
                  Confirmação Necessária
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                  Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada para ativar sua conta.
                </Typography>
                <Link href="/login" passHref>
                  <Button variant="outlined" fullWidth>
                    Voltar para o Login
                  </Button>
                </Link>
              </>
            ) : (
              // FORMULÁRIO DE REGISTRO ORIGINAL
              <>
                <PersonAddOutlinedIcon sx={{ mb: 1, fontSize: '2rem' }} />
                <Typography component="h1" variant="h5">
                  Criar Conta
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField margin="normal" required fullWidth id="email" label="Endereço de E-mail" name="email" autoComplete="email" autoFocus />
                  <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" />
                  <TextField margin="normal" required fullWidth name="confirmPassword" label="Confirmar Senha" type="password" id="confirmPassword" />
                  
                  {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: '8px' }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
                  </Button>
                  <Box textAlign="center">
                    <Link href="/login" passHref>
                      <Typography variant="body2" component="a" sx={{ textDecoration: 'none', color: 'primary.main' }}>
                        Já tem uma conta? Faça login
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              </>
            )}
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}