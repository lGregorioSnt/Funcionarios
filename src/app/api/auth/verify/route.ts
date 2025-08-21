import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import crypto from 'crypto';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
  id: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=notoken', request.url));
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE token_verificacao = ? AND token_expiracao > NOW()',
      [hashedToken]
    );

    const users = rows as User[];
    if (users.length === 0) {
      return NextResponse.redirect(new URL('/login?error=invalidtoken', request.url));
    }
    
    const user = users[0];
    
    // Atualiza o usuário para verificado e limpa o token
    await connection.execute(
      'UPDATE usuarios SET email_verificado = TRUE, token_verificacao = NULL, token_expiracao = NULL WHERE id = ?',
      [user.id]
    );

    // Redireciona para a página de login com uma mensagem de sucesso
    return NextResponse.redirect(new URL('/login?verified=true', request.url));
    
  } catch (error) {
    console.error("ERRO NA VERIFICAÇÃO:", error);
    return NextResponse.redirect(new URL('/login?error=servererror', request.url));
  } finally {
    if (connection) await connection.end();
  }
}