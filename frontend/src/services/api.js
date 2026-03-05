import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
})

// Interceptador para injetar o Token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken')
  if (token) {
    const cleanToken = token.replace(/^"(.*)"$/, '$1')
    config.headers.Authorization = `Bearer ${cleanToken}`
  }
  return config
})

// ========================
// LIVROS
// ========================
export async function getAllBooks(config) {
  const response = await api.get('/livros', config)
  return response.data
}

export async function getBookById(id) {
  const response = await api.get(`/livros/${id}`)
  return response.data
}

export async function criarLivro(data) {
  const response = await api.post('/livros', data)
  return response.data
}

export async function atualizarLivro(id, data) {
  const response = await api.put(`/livros/${id}`, data)
  return response.data
}

export async function deletarLivro(id) {
  const response = await api.delete(`/livros/${id}`)
  return response.data
}

// ========================
// USUÁRIOS
// ========================
export async function login({ identifier, senha }) {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
  const payload = { senha }
  if (isEmail) {
    payload.email = identifier
  } else {
    payload.usuario = identifier
  }
  const response = await api.post('/usuarios/login', payload)
  return response.data
}

export async function cadastrar({ nome, email, dataNascimento, curso, celular, senha }) {
  const response = await api.post('/usuarios/cadastrar', {
    nome, email, data_nascimento: dataNascimento, curso, celular, senha
  })
  return response.data
}

export async function verificarCodigo({ email, codigo }) {
  const response = await api.post('/usuarios/verificar', { email, codigo })
  return response.data
}

export async function recuperarSenha({ usuario, senha, confirmarSenha }) {
  const response = await api.post('/usuarios/newpass', { usuario, senha, confirmarSenha })
  return response.data
}

export async function getUsuarios() {
  const response = await api.get('/usuarios')
  return response.data
}

export async function deleteUsuario(id) {
  const response = await api.delete(`/usuarios/${id}`)
  return response.data
}

// ========================
// FAVORITOS
// ========================
export async function getFavoritos(usuarioId) {
  const response = await api.get(`/favoritos/${usuarioId}`)
  return response.data
}

export async function addFavorito({ usuario_id, livro_id }) {
  const response = await api.post('/favoritos', { usuario_id, livro_id })
  return response.data
}

export async function deleteFavorito(idFavorito) {
  const response = await api.delete(`/favoritos/${idFavorito}`)
  return response.data
}

// ========================
// RESERVAS
// ========================
export async function getReservas() {
  const response = await api.get('/reservas')
  return response.data
}

export async function criarReserva({ livro_id, usuario_id, data_devolucao }) {
  const response = await api.post('/reservas', { livro_id, usuario_id, data_devolucao })
  return response.data
}

export async function deleteReserva(id) {
  const response = await api.delete(`/reservas/${id}`)
  return response.data
}

export async function confirmarReserva(id) {
  const response = await api.put(`/reservas/${id}/confirmar`)
  return response.data
}

// ========================
// AVALIAÇÕES
// ========================
export async function getAvaliacoes(livroId) {
  const response = await api.get(`/avaliacoes/livro/${livroId}`)
  return response.data
}

export async function postAvaliacao({ livro_id, usuario_id, nota, comentario }) {
  const response = await api.post('/avaliacoes', { livro_id, usuario_id, nota, comentario })
  return response.data
}

export default api
