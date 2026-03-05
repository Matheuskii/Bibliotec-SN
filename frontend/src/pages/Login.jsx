import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'
import { useDarkMode } from '../hooks/useDarkMode'

export default function Login() {
    const [identifier, setIdentifier] = useState('')
    const [senha, setSenha] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const darkMode = useDarkMode()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const data = await login({ identifier, senha })

            if (data.sucesso) {
                localStorage.setItem('userToken', data.token)
                localStorage.setItem('usuarioId', data.usuario.id)
                localStorage.setItem('perfilUsuario', data.usuario.perfil)
                localStorage.setItem('usuarioNome', data.usuario.nome)
                navigate('/')
                window.location.reload()
            } else {
                setError(data.mensagem || 'Credenciais inválidas.')
            }
        } catch (err) {
            setError(err.response?.data?.mensagem || 'Erro ao conectar com o servidor.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-login">
            <button
                className="dark-mode-toggle"
                id="dark-mode-btn"
                title="Modo escuro"
                type="button"
                onClick={darkMode.toggle}
            >
                {darkMode.isDarkMode ? '☀️' : '🌙'}
            </button>

            <main className="login-container">
                <img src="/images/Logo-Bibliotec.png" alt="Logo BiblioTec" className="logo" />

                <form id="loginForm" className="login-form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        id="loginInput"
                        name="loginInput"
                        placeholder="Usuário ou Email"
                        className="input-field"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />

                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        placeholder="Senha"
                        className="input-field"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />

                    <div className="options">
                        <label>
                            <input type="checkbox" name="lembrar" /> Lembre-se de mim
                        </label>
                        <Link to="/nova-senha">Esqueceu sua senha?</Link>
                    </div>

                    {error && <p style={{ color: '#e74c3c', fontSize: 13, marginBottom: 10 }}>{error}</p>}

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </main>

            <main className="login-container-abaixo">
                <form className="login-form">
                    <Link to="/cadastro">
                        <button type="button" className="btn-cadastro">Cadastrar-se</button>
                    </Link>
                </form>
            </main>
        </div>
    )
}
