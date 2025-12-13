import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
// ============================
//  Conexão com o MariaDB
// ============================
const user_env = process.env.DB_USER || "root";
const password_env = process.env.DB_PASSWORD || "senai";
const database_env = process.env.DB_NAME || "dblivraria";
const host_env = process.env.DB_HOST || "localhost";
export const db = await mysql.createConnection({
  host: host_env,
  user: user_env,
  password: password_env,
  database: database_env,
  port: 3306,
});

console.log("✅ Conectado ao banco de dados dblivraria!");

export default db;