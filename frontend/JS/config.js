// ============================
//  Configuração Central da API
// ============================
// Em desenvolvimento: http://localhost:3000
// Em produção: troque pelo domínio do seu servidor (ex: https://api.meusite.com)
import "dotenv/config";

const API_BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";


export default API_BASE_URL;
