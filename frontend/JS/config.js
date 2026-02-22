// ============================
//  Configuração Central da API
// ============================

// Se estiver rodando no navegador na Vercel ou Render, a URL completa não é necessária.
// O próprio navegador entende que "/api" refere-se ao domínio atual.
const isProduction = window.location.hostname !== "localhost";

const API_BASE_URL = isProduction 
    ? "/api" 
    : "http://localhost:3000/api";

export default API_BASE_URL;