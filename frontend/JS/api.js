// Função para fazer fetch autenticado
export async function fetchAuth(url, options = {}) {
    // 1. Pega o token salvo no login
    const token = localStorage.getItem("userToken"); // Verifique se salvou com esse nome no loginUsuario

    // 2. Prepara os headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // 3. Se tiver token, adiciona no cabeçalho Authorization
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 4. Faz a requisição original com o token injetado
    const response = await fetch(url, {
        ...options,
        headers
    });

    // 5. Se der erro 401 (Token inválido/expirado), desloga o usuário
    if (response.status === 401 || response.status === 403) {
        showToast("Sessão expirada. Faça login novamente.", 'success');
        localStorage.clear();
        window.location.href = "Login.html";
        return null;
    }

    return response;
}