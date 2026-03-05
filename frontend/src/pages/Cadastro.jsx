import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cadastrar, verificarCodigo } from '../services/api'
import { useDarkMode } from '../hooks/useDarkMode'

export default function Cadastro() {
    const [form, setForm] = useState({
        nome: '', email: '', dataNascimento: '', curso: '', celular: '', senha: '', confirmarSenha: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [codigo, setCodigo] = useState('')
    const navigate = useNavigate()
    const darkMode = useDarkMode()

    const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.senha !== form.confirmarSenha) {
            setError('As senhas não coincidem.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const data = await cadastrar(form)
            if (data.sucesso || data.mensagem?.includes('código')) {
                setShowModal(true)
            } else {
                setError(data.mensagem || 'Erro ao cadastrar.')
            }
        } catch (err) {
            setError(err.response?.data?.mensagem || 'Erro ao conectar com o servidor.')
        } finally {
            setLoading(false)
        }
    }

    const confirmarCodigo = async () => {
        try {
            const data = await verificarCodigo({ email: form.email, codigo })
            if (data.sucesso) {
                alert('Cadastro confirmado! Faça login.')
                navigate('/login')
            } else {
                setError(data.mensagem || 'Código inválido.')
            }
        } catch (err) {
            setError(err.response?.data?.mensagem || 'Erro ao verificar código.')
        }
    }

    return (
        <div className="page-cadastro">
            <header>
                <img className="logo" src="/images/Logo-Bibliotec.png" alt="Logo BiblioTec" />
                <h1>BIBLIO TEC</h1>
                <button className="dark-mode-toggle" id="dark-mode-btn" title="Modo escuro" type="button" onClick={darkMode.toggle}>
                    {darkMode.isDarkMode ? '☀️' : '🌙'}
                </button>
            </header>

            <main className="login-container">
                <form id="cadastroForm" onSubmit={handleSubmit}>
                    <input type="text" id="nome" placeholder="Nome Completo" className="input-field" required value={form.nome} onChange={handleChange} />
                    <input type="email" id="email" placeholder="E-mail Institucional" className="input-field" required value={form.email} onChange={handleChange} />
                    <label htmlFor="dataNascimento">Data de Nascimento</label>
                    <input type="date" id="dataNascimento" className="input-field" required value={form.dataNascimento} onChange={handleChange} />
                    <input type="text" id="curso" placeholder="Curso Técnico (Ex: DS)" className="input-field" required value={form.curso} onChange={handleChange} />
                    <input type="tel" id="celular" placeholder="Celular (somente números)" className="input-field" required value={form.celular} onChange={handleChange} />
                    <input type="password" id="senha" placeholder="Crie uma senha" className="input-field" required value={form.senha} onChange={handleChange} />
                    <input type="password" id="confirmarSenha" placeholder="Confirme sua senha" className="input-field" required value={form.confirmarSenha} onChange={handleChange} />

                    {error && <p style={{ color: '#e74c3c', fontSize: 13 }}>{error}</p>}

                    <button type="submit" className="btn-cadastro2" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                    <p className="login-link">Já possui conta? <Link to="/login">Faça login</Link></p>
                </form>
            </main>

            {showModal && (
                <div id="modalVerificacao" className="modal-overlay">
                    <div className="modal-content">
                        <h3>📧 Verifique seu E-mail</h3>
                        <p>Enviamos um código para: <strong>{form.email}</strong></p>
                        <input type="text" id="codigoInput" placeholder="Ex: 123456" maxLength="6" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                        <button type="button" onClick={confirmarCodigo}>Confirmar Cadastro</button>
                        <p style={{ marginTop: 15, fontSize: 12, cursor: 'pointer', color: 'red' }} onClick={() => setShowModal(false)}>
                            Fechar / Corrigir E-mail
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
