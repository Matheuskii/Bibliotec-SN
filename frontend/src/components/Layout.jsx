import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDarkMode } from '../hooks/useDarkMode'

export default function Layout({ children }) {
  const auth = useAuth()
  const darkMode = useDarkMode()

  return (
    <>
      <header>
        <button className="hamburger" aria-label="Abrir menu" type="button">
          ☰
        </button>
        <img className="logo" src="/images/LogoBibliotec.png" alt="Logo BiblioTec" />
        <h1>BIBLIO TEC</h1>
        <button
          className="dark-mode-toggle"
          id="dark-mode-btn"
          title="Modo escuro"
          type="button"
          onClick={darkMode.toggle}
        >
          {darkMode.isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <nav>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/favoritos">Favoritos</Link>
        <Link to="/reservas">Minhas Reservas</Link>
        {auth.isAdmin ? (
          <Link
            to="/admin"
            id="btnAdminPanel"
            style={{ color: '#ff0000', fontWeight: 'bold', display: 'inline-block' }}
          >
            Painel Admin
          </Link>
        ) : null}
        {auth.isLoggedIn ? (
          <a
            href="#"
            id="btnAuth"
            style={{ textDecoration: 'none', color: '#4a67df', fontWeight: 'bold' }}
            onClick={(e) => {
              e.preventDefault()
              auth.logout()
            }}
          >
            Sair
          </a>
        ) : (
          <Link id="btnAuth" to="/login" style={{ textDecoration: 'none', color: '#4a67df', fontWeight: 'bold' }}>
            Login
          </Link>
        )}
      </nav>

      {children}

      <footer>
        <div className="footer-content">
          <p>© 2025 BiblioTec - Todos os direitos reservados.</p>
          <div className="footer-links">
            <a href="#">Sobre</a>
            <a href="#">Termos de Uso</a>
            <a href="#">Privacidade</a>
            <a href="#">Contato</a>
          </div>
        </div>
      </footer>
    </>
  )
}

