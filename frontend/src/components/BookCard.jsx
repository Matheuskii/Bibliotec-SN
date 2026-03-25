import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function BookCard({ livro }) {
  const navigate = useNavigate()

  // URL base do servidor (sem o /api) para arquivos estáticos
  const serverBase = (api.defaults.baseURL || '').replace(/\/api\/?$/, '')

  const capa = useMemo(() => {
    let p = livro?.caminho_capa || livro?.capa_url || '/images/capa-default.jpg'
    
    // Se já é URL completa ou path para imagem default, usa direto
    if (p.startsWith('http') || p.startsWith('data:') || p.startsWith('/images/')) {
      return p
    }

    // Remove barra inicial se houver (ex: '/capas/x.jpg' -> 'capas/x.jpg')
    if (p.startsWith('/')) p = p.slice(1)

    // Monta a URL apontando para o backend: ex: 'capas/hobbit.jpg' -> 'https://backend/capas/hobbit.jpg'
    return `${serverBase}/${p}`
  }, [livro, serverBase])

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

