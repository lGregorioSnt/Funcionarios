// src/components/PersonModal.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Stack,
  Snackbar
} from '@mui/material';
import { Person } from '../types';
import { useSnackbar } from '@/contexts/SnackbarContext'; // Adicionado

// Opcional: se quiser redirecionar em caso de token expirado
// import { useRouter } from 'next/navigation';

interface PersonModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  person: Person | null;
}

export default function PersonModal({ open, onClose, onSave, person }: PersonModalProps) {
   const { showSnackbar } = useSnackbar(); // Adicionado
  const [formData, setFormData] = useState({ nome: '', idade: '', telefone: '' });
  // const router = useRouter(); // Opcional

  useEffect(() => {
    if (person) {
      setFormData({
        nome: person.nome,
        idade: String(person.idade),
        telefone: person.telefone,
      });
    } else {
      setFormData({ nome: '', idade: '', telefone: '' });
    }
  }, [person, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ----- INÍCIO DA CORREÇÃO -----
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // 1. Pega o token do localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Sua sessão expirou. Por favor, faça login novamente.');
      // router.push('/login'); // Opcional: redireciona para o login
      return;
    }

    const url = person ? `/api/pessoas/${person.id}` : '/api/pessoas';
    const method = person ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // 2. Adiciona o token no cabeçalho da requisição
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          idade: Number(formData.idade),
        }),
      });

      if (response.ok) {
        showSnackbar("Dados Salvos com sucesso.", "success");
        onSave();
      } else {
        const errorData = await response.json();
        alert(`Falha ao salvar: ${errorData.message}`);
        if (response.status === 401) {
          // router.push('/login'); // Opcional
        }
      }
    } catch (error) {
        alert('Ocorreu um erro de rede ao salvar.');
    }
  };
  // ----- FIM DA CORREÇÃO -----

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{person ? 'Editar Pessoa' : 'Adicionar Nova Pessoa'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField name="nome" label="Nome Completo" value={formData.nome} onChange={handleChange} required fullWidth />
            <TextField name="idade" label="Idade" type="number" value={formData.idade} onChange={handleChange} required fullWidth />
            <TextField name="telefone" label="Telefone" value={formData.telefone} onChange={handleChange} required fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}