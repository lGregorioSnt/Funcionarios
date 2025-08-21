// app/page.tsx
'use client'; // Necessário para usar hooks como o useRouter

import { useRouter } from 'next/navigation';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Em uma aplicação real, aqui você faria a autenticação
    console.log("Login simulado com sucesso!");
    router.push('/people');
  };

  return (
    <>
     <Card sx={{ 
  maxWidth: 345, 
  margin: 'auto',
  my: '300px',
  display: 'flex', 
  flexDirection: 'column', 
  gap: 2,
  backgroundColor: 'white',
  padding: 4,
  borderRadius: 4,
  boxShadow: 10,
  
  }}>
    
       
<TextField id="standard-basic" label="Email" variant="standard" />
    <TextField id="standard-basic" label="Senha" variant="standard" />
    <Button onClick={handleLogin} color='warning' variant="contained">Entrar</Button>

     
      
    </Card></>
  );
}