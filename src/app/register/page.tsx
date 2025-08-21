// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Button, Card, CardContent, TextField, Typography, Container, Alert } from '@mui/material';

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

      // ----- INÍCIO DA MUDANÇA -----
      if (res.ok) {
        const { token } = await res.json(); // Pega o token da resposta da API
        localStorage.setItem('authToken', token); // Salva o token no localStorage

        setSuccess('Usuário registrado com sucesso! Entrando...');
        
        // Redireciona para o DASHBOARD, não para o login
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);

      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Falha ao registrar.');
      }
      // ----- FIM DA MUDANÇA -----

    } catch (err) {
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Criar Conta
        </Typography>
        <Card sx={{ mt: 3, p: 2, width: '100%' }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField margin="normal" required fullWidth id="email" label="Endereço de E-mail" name="email" autoComplete="email" autoFocus />
              <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" />
              <TextField margin="normal" required fullWidth name="confirmPassword" label="Confirmar Senha" type="password" id="confirmPassword" />
              
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
              
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Registrar
              </Button>
              <Box textAlign="center">
                <Link href="/login" passHref>
                  <Typography variant="body2" component="a" sx={{ textDecoration: 'none' }}>
                    Já tem uma conta? Faça login
                  </Typography>
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}