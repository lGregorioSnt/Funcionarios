// src/app/api/pessoas/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import jwt from 'jsonwebtoken'; // <-- Adicionar import

// Função auxiliar para verificar o token
const verifyToken = (request: Request): { authorized: boolean; message?: string } => {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token || !process.env.JWT_SECRET) {
    return { authorized: false, message: 'Não autorizado.' };
  }
  
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return { authorized: true };
  } catch (error) {
    return { authorized: false, message: 'Token inválido.' };
  }
};


// GET: Busca todas as pessoas (agora protegido)
export async function GET(request: Request) {
  // ----- INÍCIO DA MUDANÇA -----
  const auth = verifyToken(request);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: 401 });
  }
  // ----- FIM DA MUDANÇA -----

  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM pessoas ORDER BY nome ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  } finally {
    await connection.end();
  }
}

// POST: Cria uma nova pessoa (agora protegido)
export async function POST(request: Request) {
  // ----- INÍCIO DA MUDANÇA -----
  const auth = verifyToken(request);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: 401 });
  }
  // ----- FIM DA MUDANÇA -----

  const connection = await getConnection();
  try {
    const { nome, idade, telefone } = await request.json();
    const [result] = await connection.execute(
      'INSERT INTO pessoas (nome, idade, telefone) VALUES (?, ?, ?)',
      [nome, idade, telefone]
    );
    const insertId = (result as any).insertId;
    const [newPerson] = await connection.execute('SELECT * FROM pessoas WHERE id = ?', [insertId]);
    return NextResponse.json((newPerson as any)[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  } finally {
    await connection.end();
  }
}