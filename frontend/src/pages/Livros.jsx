import { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import BookCard from '../components/BookCard'
import { getAllBooks } from '../services/api'

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'fisico', label: 'Físicos' },
  { id: 'romance', label: 'Romance' },
  { id: 'ficcao', label: 'Ficção' },
  { id: 'terror', label: 'Terror' },
  { id: 'tecnologia', label: 'Tecnologia' },
]

function normalizar(texto) {
  return (texto ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function Livros() {
  const [livros, setLivros] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busca, setBusca] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState('todos')

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      try {
        setIsLoading(true)
        const data = await getAllBooks()
        if (!cancelado) setLivros(Array.isArray(data) ? data : [])
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

  const livrosFiltrados = useMemo(() => {
    const termo = normalizar(busca)

    return livros.filter((livro) => {
      const titulo = normalizar(livro?.titulo)
      const autor = normalizar(livro?.autor)
      const genero = normalizar(livro?.genero)
      const formato = normalizar(livro?.formato)

      const correspondeBusca =
        !termo || titulo.includes(termo) || autor.includes(termo) || genero.includes(termo)

      if (!correspondeBusca) return false

      if (filtroAtivo === 'todos') return true

      if (filtroAtivo === 'fisico') {
        return formato.includes('fisico') || formato.includes('físico')
      }

      if (filtroAtivo === 'romance') {
        return genero.includes('romance')
      }

      if (filtroAtivo === 'ficcao') {
        return genero.includes('ficcao') || genero.includes('ficção') || genero.includes('cientifica')
      }

      if (filtroAtivo === 'terror') {
        return genero.includes('terror')
      }

      if (filtroAtivo === 'tecnologia') {
        return genero.includes('tecnologia') || genero.includes('tech')
      }

      return true
    })
  }, [livros, busca, filtroAtivo])

  return (
    <Layout>
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          id="inputBusca"
          placeholder="Pesquisar por título, autor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <span className="search-icon">
          <img src="/images/Lupa.png" alt="Ícone de lupa" />
        </span>
      </div>

      <main className="catalogo">
        <div className="catalogo-header">
          <h2>Catálogo De Livros</h2>
        </div>

        <div className="filter-container">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`filter-btn${filtroAtivo === filter.id ? ' active' : ''}`}
              onClick={() => setFiltroAtivo(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="books-grid" id="todos-livros">
          {isLoading && <p className="no-books">Carregando livros...</p>}
          {error && !isLoading && <p className="error-message">Erro ao carregar livros.</p>}
          {!isLoading && !error && livrosFiltrados.length === 0 && (
            <p className="no-books">Nenhum livro encontrado 😢</p>
          )}
          {!isLoading &&
            !error &&
            livrosFiltrados.map((livro) => <BookCard key={livro.id ?? livro.titulo} livro={livro} />)}
        </div>
      </main>
    </Layout>
  )
}

