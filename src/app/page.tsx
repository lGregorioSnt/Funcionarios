'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <-- Import necessário para o link
import { Box, Button, Card, CardContent, TextField, Typography, Container } from '@mui/material';

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
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Card sx={{ mt: 3, p: 2, width: '100%' }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate>
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
              {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Entrar
              </Button>
              
              {/* ----- INÍCIO DA ADIÇÃO ----- */}
              <Box textAlign="center">
                <Link href="/register" passHref>
                  <Typography variant="body2" component="a" sx={{ textDecoration: 'none' }}>
                    Não tem uma conta? Registre-se
                  </Typography>
                </Link>
              </Box>
              {/* ----- FIM DA ADIÇÃO ----- */}

            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}