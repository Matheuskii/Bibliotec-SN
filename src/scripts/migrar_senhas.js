// Script para migrar senhas em texto puro para hashes bcrypt
// Uso: node src/scripts/migrar_senhas.js
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'senai',
  database: process.env.DB_NAME || 'dblivraria',
  port: Number(process.env.DB_PORT) || 3306
});

console.log('🔄 Buscando usuários com senhas não-hash...\n');

const [usuarios] = await db.execute('SELECT id, nome, email, senha FROM usuarios');
let migrados = 0;
let jaHash = 0;

for (const u of usuarios) {
  // Senhas bcrypt sempre começam com $2a$ ou $2b$
  if (u.senha.startsWith('$2a$') || u.senha.startsWith('$2b$')) {
    jaHash++;
    continue;
  }

  console.log(`  🔑 Migrando: ${u.nome} (${u.email}) — senha em texto puro detectada`);
  const senhaHash = await bcrypt.hash(u.senha, 12);
  await db.execute('UPDATE usuarios SET senha = ? WHERE id = ?', [senhaHash, u.id]);
  migrados++;
}

console.log(`\n✅ Migração concluída!`);
console.log(`   ${migrados} senha(s) migrada(s) para bcrypt`);
console.log(`   ${jaHash} senha(s) já estavam com hash`);

await db.end();
