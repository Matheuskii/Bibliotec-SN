import { useEffect, useMemo, useRef } from 'react'
import BookCard from './BookCard'

export default function Carousel({ livros, leftButtonId, rightButtonId }) {
  const gridRef = useRef(null)

  const items = useMemo(() => (Array.isArray(livros) ? livros : []), [livros])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const cards = Array.from(grid.querySelectorAll('.book-card'))
    if (cards.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            cards.forEach((c) => c.classList.remove('center'))
            entry.target.classList.add('center')
          }
        }
      },
      { root: grid, threshold: 0.6 },
    )

    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [items])

  return (
    <div className="books-container">
      <div className="carousel-wrapper">
        <button
          className="arrow-left"
          id={leftButtonId}
          type="button"
          aria-label="Anterior"
          onClick={() => gridRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
        >
          ◀
        </button>

        <div className="books-grid" ref={gridRef}>
          {items.length === 0 ? <p className="no-books">Sem itens nesta categoria</p> : null}
          {items.map((livro) => (
            <BookCard key={livro.id ?? `${livro.titulo}-${Math.random()}`} livro={livro} />
          ))}
        </div>

        <button
          className="arrow-right"
          id={rightButtonId}
          type="button"
          aria-label="Próximo"
          onClick={() => gridRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
        >
          ▶
        </button>
      </div>
    </div>
  )
}

