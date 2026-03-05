import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { getFavoritos, deleteFavorito } from '../services/api'
import BookCard from '../components/BookCard'

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId')
    if (!usuarioId) {
      setIsLoading(false)
      return
    }

    let cancelado = false
    async function carregar() {
      try {
        setIsLoading(true)
        const data = await getFavoritos(usuarioId)
        if (!cancelado) setFavoritos(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelado) setError(err)
      } finally {
        if (!cancelado) setIsLoading(false)
      }
    }
    carregar()
    return () => {
      cancelado = true
    }
  }, [])

  const usuarioId = localStorage.getItem('usuarioId')

  const handleRemover = async (idFavorito) => {
    try {
      await deleteFavorito(idFavorito)
      setFavoritos((prev) => prev.filter((f) => f.id !== idFavorito))
    } catch (err) {
      console.error(err)
      alert('Erro ao remover favorito.')
    }
  }

  return (
    <Layout>
      <main className="favoritos-wrapper">
        <h2 className="titulo-secao">Meus Livros Favoritos (❁´◡`❁)</h2>

        {!usuarioId && (
          <div className="empty-state">
            <p>Você precisa estar logado para ver seus favoritos.</p>
            <a href="/login" style={{ color: '#4a67df', fontWeight: 'bold' }}>
              Ir para Login
            </a>
          </div>
        )}

        {usuarioId && (
          <div id="gridFavoritos" className="favoritos-grid">
            {isLoading && <p style={{ textAlign: 'center', width: '100%' }}>Carregando...</p>}
            {error && !isLoading && <p>Erro ao carregar favoritos.</p>}
            {!isLoading && !error && favoritos.length === 0 && (
              <div className="empty-state">
                <h3>Sua lista está vazia ¯\_(ツ)_/¯</h3>
                <p>
                  Vá ao <a href="/catalogo">Catálogo</a> e adicione livros que você ama!
                </p>
              </div>
            )}

            {!isLoading &&
              !error &&
              favoritos.map((fav) => (
                <div key={fav.id} className="card-favorito">
                  {/* Reaproveita BookCard quando possível */}
                  <BookCard
                    livro={{
                      id: fav.livro_id,
                      titulo: fav.livro_titulo,
                      autor: fav.livro_autor,
                      caminho_capa: fav.caminho_capa,
                    }}
                  />
                  <button className="btn-remover" type="button" onClick={() => handleRemover(fav.id)}>
                    🗑️ Remover
                  </button>
                </div>
              ))}
          </div>
        )}
      </main>
    </Layout>
  )
}

