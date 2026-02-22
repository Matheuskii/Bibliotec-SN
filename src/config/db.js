import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const user_env   = process.env.DB_USER     || "root";
const password_env = process.env.DB_PASS   || "";
const database_env = process.env.DB_NAME   || "dblivraria";
const host_env   = process.env.DB_HOST     || "localhost";
const port_env   = process.env.DB_PORT     || 3306;

export const db = await mysql.createConnection({
  host:     host_env,
  user:     user_env,
  password: password_env,
  database: database_env,
  port:     Number(port_env),
  ssl: {
    rejectUnauthorized: false 
  }
});

console.log("✅ Conectado ao banco de dados!");
export default db;