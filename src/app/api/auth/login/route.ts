import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

// Definindo a estrutura de dados do usuário, incluindo o novo campo
interface User extends RowDataPacket {
  id: number;
  email: string;
  password_hash: string;
  email_verificado: boolean; // Ou 0 | 1 se o seu banco guardar como TINYINT
}

export async function POST(request: Request) {
  let connection;
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email e senha são obrigatórios.' }, { status: 400 });
    }

    connection = await getConnection();

    // 1. Encontrar o usuário pelo email
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    const users = rows as User[];

    if (users.length === 0) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }
    const user = users[0];

    // ----- INÍCIO DA MUDANÇA -----
    // 2. VERIFICAR SE O E-MAIL DO USUÁRIO FOI CONFIRMADO
    if (!user.email_verificado) {
      return NextResponse.json(
        { message: 'Por favor, confirme seu e-mail antes de fazer o login. Verifique sua caixa de entrada.' },
        { status: 403 } // 403 Forbidden: Acesso negado
      );
    }
    // ----- FIM DA MUDANÇA -----


    // 3. Comparar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }

    // 4. Se a senha for válida, criar o Token JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('A chave secreta JWT não foi definida no .env.local');
      throw new Error('Erro de configuração no servidor.');
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '1h' }
    );

    // 5. Retorna o token para o frontend
    return NextResponse.json({ token });

  } catch (error: any) {
    console.error("ERRO NO LOGIN:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}