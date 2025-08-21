// src/lib/db.ts
import mysql from 'mysql2/promise';

export const dbConfig = {
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'root',
  database: 'NextjsApp', // Verifique se o nome está correto
};

export const getConnection = () => {
  return mysql.createConnection(dbConfig);
};