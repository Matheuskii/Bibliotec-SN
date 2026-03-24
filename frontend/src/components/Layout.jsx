import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDarkMode } from '../hooks/useDarkMode'

export default function Layout({ children }) {
  const auth = useAuth()
  const darkMode = useDarkMode()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header>
        <button
          className="hamburger"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          type="button"
          onClick={toggleMenu}
        >
          {menuOpen ? '✕' : '☰'}
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

      <nav className={menuOpen ? 'open' : ''}>
        <Link to="/" onClick={closeMenu}>Início</Link>
        <Link to="/catalogo" onClick={closeMenu}>Catálogo</Link>
        <Link to="/favoritos" onClick={closeMenu}>Favoritos</Link>
        <Link to="/reservas" onClick={closeMenu}>Minhas Reservas</Link>
        {auth.isAdmin && (
          <Link
            to="/admin"
            id="btnAdminPanel"
            className="nav-admin"
            onClick={closeMenu}
          >
            Painel Admin
          </Link>
        )}
        {auth.isLoggedIn ? (
          <a
            href="#"
            id="btnAuth"
            className="nav-auth"
            onClick={(e) => {
              e.preventDefault()
              auth.logout()
              closeMenu()
            }}
          >
            Sair
          </a>
        ) : (
          <Link id="btnAuth" to="/login" className="nav-auth" onClick={closeMenu}>
            Login
          </Link>
        )}
      </nav>

      {children}

      <footer>
        <div className="footer-content">
          <p>© 2025 BiblioTec — Todos os direitos reservados.</p>
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
