import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recuperarSenha } from '../services/api'
import { useDarkMode } from '../hooks/useDarkMode'

export default function NovaSenha() {
    const [usuario, setUsuario] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const darkMode = useDarkMode()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const data = await recuperarSenha({ usuario, senha, confirmarSenha })
            if (data.sucesso) {
                alert('Senha alterada com sucesso!')
                navigate('/login')
            } else {
                setError(data.mensagem || 'Erro ao recuperar senha.')
            }
        } catch (err) {
            setError(err.response?.data?.mensagem || 'Erro ao conectar com o servidor.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-novasenha">
            <header>
                <img className="logo" src="/images/Logo-Bibliotec.png" alt="Logo BiblioTec" />
                <h1>BIBLIO TEC</h1>
                <button className="dark-mode-toggle" id="dark-mode-btn" title="Modo escuro" type="button" onClick={darkMode.toggle}>
                    {darkMode.isDarkMode ? '☀️' : '🌙'}
                </button>
            </header>

            <main className="login-container">
                <form id="newpassForm" onSubmit={handleSubmit}>
                    <input type="text" id="usuario" placeholder="Digite seu usuário ou email" className="input-field" required value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                    <input type="password" id="senha" placeholder="Nova senha" className="input-field" required value={senha} onChange={(e) => setSenha(e.target.value)} />
                    <input type="password" id="confirmarSenha" placeholder="Confirme a senha" className="input-field" required value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />

                    {error && <p style={{ color: '#e74c3c', fontSize: 13 }}>{error}</p>}

                    <button type="submit" className="btn-recuperar" disabled={loading}>
                        {loading ? 'Processando...' : 'Finalizar'}
                    </button>
                </form>
            </main>
        </div>
    )
}
