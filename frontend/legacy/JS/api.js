import API_BASE_URL from "./config.js";

// Função para fazer fetch autenticado
export async function fetchAuth(url, options = {}) {
    const token = localStorage.getItem("userToken");

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        showToast("Sessão expirada. Faça login novamente.", 'error');
        localStorage.clear();
        window.location.href = "Login.html";
        return null;
    }

    return response;
}

export { API_BASE_URL };
