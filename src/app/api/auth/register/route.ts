// Caminho: src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // <-- Adicionar import

export async function POST(request: Request) {
  let connection;
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email e senha são obrigatórios.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    connection = await getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO usuarios (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );

    const newUserId = (result as any).insertId;

    // ----- INÍCIO DA MUDANÇA -----
    // LÓGICA ADICIONADA: Gerar o token automaticamente após o registro

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('A chave secreta JWT não foi definida.');
    }

    const token = jwt.sign(
      { userId: newUserId, email: email }, // Payload do token
      secret,
      { expiresIn: '1h' } // Validade
    );

    // Retorna a mensagem de sucesso E o token
    return NextResponse.json({ message: 'Usuário criado com sucesso!', token }, { status: 201 });
    // ----- FIM DA MUDANÇA -----

  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'Este email já está em uso.' }, { status: 409 });
    }
    console.error("ERRO AO REGISTRAR:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}