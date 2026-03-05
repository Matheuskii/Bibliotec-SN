import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Página não encontrada</h1>
      <p>
        Voltar para <Link to="/">início</Link>.
      </p>
    </main>
  )
}

