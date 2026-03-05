import api from './api'

export async function listarLivros() {
  const { data } = await api.get('/livros')
  return Array.isArray(data) ? data : []
}

export async function buscarLivroPorId(id) {
  const { data } = await api.get(`/livros/${id}`)
  return data ?? null
}

