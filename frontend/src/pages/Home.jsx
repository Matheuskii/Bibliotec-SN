import Carousel from '../components/Carousel'
import Layout from '../components/Layout'
import { useLivros } from '../hooks/useLivros'

export default function Home() {
  const { data: livros, isLoading, error } = useLivros()

  const vendidos = livros.filter((livro) => {
    const genero = livro?.genero ? String(livro.genero).toLowerCase() : ''
    const id = Number(livro?.id)
    return genero.includes('fantasia') || genero.includes('romance') || genero.includes('infantil') || id <= 5
  })

  const ofertas = livros.filter((livro) => {
    const genero = livro?.genero ? String(livro.genero).toLowerCase() : ''
    const formato = livro?.formato ? String(livro.formato).toLowerCase() : ''
    return genero.includes('terror') || genero.includes('suspense') || genero.includes('policial') || formato === 'e-book'
  })

  return (
    <Layout>
      <div className="search-container">
        <input type="text" className="search-bar" placeholder="Pesquisar..." />
        <span className="search-icon">
          <img src="/images/Lupa.png" alt="Ícone de lupa para pesquisa" />
        </span>
      </div>

      {error ? <div className="error-message">Erro ao carregar livros.</div> : null}
      {isLoading ? <div className="no-books">Carregando...</div> : null}

      <section>
        <div className="section-header">
          <h2>Mais Procurados</h2>
        </div>
        <Carousel livros={vendidos} leftButtonId="left-vendidos" rightButtonId="right-vendidos" />
      </section>

      <section>
        <div className="section-header">
          <h2>Ofertas e Destaques</h2>
        </div>
        <Carousel livros={ofertas} leftButtonId="left-ofertas" rightButtonId="right-ofertas" />
      </section>
    </Layout>
  )
}

