// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  let connection;
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email e senha são obrigatórios.' }, { status: 400 });
    }

    connection = await getConnection();

    // 1. Encontrar o usuário pelo email no banco de dados
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    const users = rows as any[];

    // Se não encontrou nenhum usuário com esse email, retorna erro
    if (users.length === 0) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }
    const user = users[0];

    // 2. Comparar a senha enviada com a senha criptografada (hash) no banco
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    // Se as senhas não baterem, retorna erro
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }

    // 3. Se a senha for válida, criar o Token JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('A chave secreta JWT não foi definida no .env.local');
      throw new Error('Erro de configuração no servidor.');
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Informações que vão dentro do token
      secret,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    // 4. Retorna o token para o frontend
    return NextResponse.json({ token });

  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}