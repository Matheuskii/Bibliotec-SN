import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Página não encontrada</h1>
        <p className="not-found-text">
          A página que você procura não existe ou foi movida.
        </p>
        <Link to="/" className="not-found-link">
          ← Voltar ao início
        </Link>
      </div>

      <style>{`
        .not-found-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bt-bg);
          padding: var(--sp-5);
        }

        .not-found-card {
          text-align: center;
          max-width: 420px;
          animation: fadeInUp 0.5s ease both;
        }

        .not-found-code {
          font-family: var(--font-display, 'Outfit', sans-serif);
          font-size: 7rem;
          font-weight: 800;
          background: linear-gradient(135deg, #4a67df, #2fd6cb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          display: block;
          margin-bottom: var(--sp-4);
        }

        .not-found-title {
          font-family: var(--font-display, 'Outfit', sans-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--bt-text);
          margin-bottom: var(--sp-3);
        }

        .not-found-text {
          color: var(--bt-muted);
          font-size: 0.95rem;
          margin-bottom: var(--sp-6);
          line-height: 1.5;
        }

        .not-found-link {
          display: inline-block;
          padding: var(--sp-3) var(--sp-6);
          background: var(--bt-primary);
          color: white;
          border-radius: var(--r-pill, 100px);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .not-found-link:hover {
          background: #3b55c9;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(74, 103, 223, 0.35);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
