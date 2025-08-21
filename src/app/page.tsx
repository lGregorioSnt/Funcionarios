import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';

export default function MediaCard() {
  return (
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
    <Button color='success' variant="contained">Entrar</Button>

     
      
    </Card>
  );
}
