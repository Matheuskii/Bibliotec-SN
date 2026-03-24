import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function BookCard({ livro }) {
  const navigate = useNavigate()

  const capa = useMemo(() => {
    let path = livro?.caminho_capa || livro?.capa_url || '/images/capa-default.jpg'
    
    // Se a string já é uma URL completa ou já é um absolute path para /images/, usa direto
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/images/')) {
        return path
    }

    // Se a string começar com 'capas/', é o formato retornado pelo banco de dados atual
    if (path.startsWith('/capas/')) {
        // Aponta para o servidor backend que acabou de ser configurado para servir a pasta public
        return `${api.defaults.baseURL}/${path}`
    }

    // Fallback: se não tiver barra na frente, adiciona (ex: 'livro1.jpg' -> '/capas/livro1.jpg')
    if (!path.startsWith('/')) {
      return `${api.defaults.baseURL}/capas/${path}`
    }
    
    // Se por acaso já começar com /capas/
    if (path.startsWith('/capas/')) {
      return `${api.defaults.baseURL}${path}`
    }

    return path
  }, [livro])

  const onOpen = () => {
    const id = livro?.id
    if (!id) return
    navigate(`/livros/${id}`)
  }

  return (
    <div
      className="book-card"
      role="button"
      tabIndex={0}
      data-id={livro?.id}
      title={livro?.titulo ? `Clique para ver detalhes de "${livro.titulo}"` : 'Clique para ver detalhes'}
      aria-label={
        livro?.titulo
          ? `Livro: ${livro.titulo}${livro?.autor ? ` por ${livro.autor}` : ''}. Clique para ver detalhes.`
          : 'Livro. Clique para ver detalhes.'
      }
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      <div className="book-cover">
        <img
          src={capa}
          alt={livro?.titulo ?? 'Capa do livro'}
          width={200}
          height={280}
          loading="lazy"
          style={{ aspectRatio: '2/3', objectFit: 'cover' }}
          onError={(e) => {
            e.currentTarget.src = '/images/capa-default.jpg'
          }}
        />
      </div>

      <div className="book-info">
        <h3 className="book-title">{livro?.titulo ?? 'Sem título'}</h3>
        <p className="book-author">{livro?.autor ?? 'Autor desconhecido'}</p>
        {livro?.preco ? <span className="book-price">R$ {livro.preco}</span> : null}
        {livro?.ano_publicacao ? <span className="book-year">{livro.ano_publicacao}</span> : null}
      </div>
    </div>
  )
}

