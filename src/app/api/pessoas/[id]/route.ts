// src/app/api/pessoas/[id]/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import jwt from 'jsonwebtoken'; // <-- Adicionar import

// Função auxiliar para verificar o token (pode ser movida para um arquivo /lib)
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


interface Params {
  params: { id: string };
}

// PUT: Atualiza uma pessoa (agora protegido)
export async function PUT(request: Request, { params }: Params) {
  const auth = verifyToken(request);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: 401 });
  }

  const connection = await getConnection();
  try {
    const { id } = params;
    const { nome, idade, telefone } = await request.json();
    await connection.execute(
      'UPDATE pessoas SET nome = ?, idade = ?, telefone = ? WHERE id = ?',
      [nome, idade, telefone, id]
    );
    const [updatedPerson] = await connection.execute('SELECT * FROM pessoas WHERE id = ?', [id]);
    return NextResponse.json((updatedPerson as any)[0]);
  } catch (error) {
    console.error("ERRO DETALHADO AO ATUALIZAR (PUT):", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// DELETE: Deleta uma pessoa (agora protegido)
export async function DELETE(request: Request, { params }: Params) {
  const auth = verifyToken(request);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: 401 });
  }

  const connection = await getConnection();
  try {
    const { id } = params;
    await connection.execute('DELETE FROM pessoas WHERE id = ?', [id]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("ERRO DETALHADO AO DELETAR (DELETE):", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}