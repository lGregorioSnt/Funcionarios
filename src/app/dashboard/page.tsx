// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress,
  createTheme,
  ThemeProvider,
  CssBaseline 
} from '@mui/material';
import PeopleList from '../components/PeopleList';

// 1. TEMA CUSTOMIZADO (O MESMO DAS TELAS DE LOGIN/REGISTRO)
const theme = createTheme({
  palette: {
    mode: 'dark', // Habilita o modo escuro
    primary: {
      main: '#e53935', // Vermelho
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(''); // Estado para o nome do usuário

  useEffect(() => {
    // 2. VERIFICAÇÃO ATUALIZADA PARA USAR O TOKEN JWT
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    } else {
      // Opcional: decodificar o token para pegar o email do usuário
      // e exibir uma mensagem de boas-vindas.
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.email);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            bgcolor: 'background.default' 
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* 3. FUNDO ESCURO APLICADO À PÁGINA */}
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom>
            Painel de Funcionários
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Bem-vindo, {userName || 'Usuário'}!
          </Typography>
          <PeopleList />
        </Container>
      </Box>
    </ThemeProvider>
  );
}