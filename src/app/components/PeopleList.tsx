'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Typography, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonModal from './PersonModal';
import ConfirmationDialog from './ConfimationDialog'; // Corrigido: 'ConfirmationDialog'
import { Person } from '../types'; // Corrigido: 'types'
import { useSnackbar } from '@/contexts/SnackbarContext'; // Adicionado

export default function PeopleList() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [personIdToDelete, setPersonIdToDelete] = useState<number | null>(null);
  const router = useRouter();
  const { showSnackbar } = useSnackbar(); // Adicionado

  const fetchPeople = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/pessoas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem('authToken');
        router.push('/login');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setPeople(data);
      }
    } catch (error) {
      console.error("Falha ao buscar dados:", error);
      showSnackbar("Não foi possível carregar os dados.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleOpenModal = (person: Person | null = null) => {
    setPersonToEdit(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPersonToEdit(null);
  };

  const handleSave = () => {
    handleCloseModal();
    fetchPeople();
  };

  const handleOpenConfirmDialog = (id: number) => {
    setPersonIdToDelete(id);
    setConfirmOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setPersonIdToDelete(null);
    setConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (personIdToDelete === null) return;

    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`/api/pessoas/${personIdToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        showSnackbar('Pessoa removida com sucesso!', 'success');
        fetchPeople();
      } else {
        showSnackbar('Falha ao remover pessoa.', 'error');
        if (response.status === 401) router.push('/login');
      }
    } catch (error) {
      showSnackbar('Ocorreu um erro de rede.', 'error');
    } finally {
      handleCloseConfirmDialog();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Lista de Pessoas</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
            Adicionar Pessoa
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Nome</b></TableCell>
                <TableCell><b>Idade</b></TableCell>
                <TableCell><b>Telefone</b></TableCell>
                <TableCell align="right"><b>Ações</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {people.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>{person.nome}</TableCell>
                  <TableCell>{person.idade}</TableCell>
                  <TableCell>{person.telefone}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenModal(person)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenConfirmDialog(person.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <PersonModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        person={personToEdit}
      />

      <ConfirmationDialog
        open={confirmOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja remover esta pessoa? Esta ação não pode ser desfeita."
      />
    </>
  );
}