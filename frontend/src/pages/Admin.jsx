import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDarkMode } from '../hooks/useDarkMode'
import { getAllBooks, criarLivro, atualizarLivro, deletarLivro, getUsuarios, deleteUsuario, getReservas, confirmarReserva } from '../services/api'

export default function Admin() {
    const [secao, setSecao] = useState('livros')
    const [livros, setLivros] = useState([])
    const [alunos, setAlunos] = useState([])
    const [reservas, setReservas] = useState([])
    const [busca, setBusca] = useState('')
    const [showModalLivro, setShowModalLivro] = useState(false)
    const [livroEdit, setLivroEdit] = useState(null)
    const navigate = useNavigate()
    const darkMode = useDarkMode()

    const perfil = localStorage.getItem('perfilUsuario')
    const adminNome = localStorage.getItem('usuarioNome') || 'Admin'

    useEffect(() => {
        if (!perfil || perfil !== 'Admin') {
            alert('Acesso restrito a Administradores.')
            navigate('/login')
        }
    }, [perfil, navigate])

    useEffect(() => {
        carregarDados()
    }, [])

    async function carregarDados() {
        try {
            const l = await getAllBooks()
            setLivros(Array.isArray(l) ? l : [])
        } catch { /* */ }
        try {
            const u = await getUsuarios()
            setAlunos(Array.isArray(u) ? u : [])
        } catch { /* */ }
        try {
            const r = await getReservas()
            const lista = Array.isArray(r?.dados) ? r.dados : Array.isArray(r) ? r : []
            setReservas(lista)
        } catch { /* */ }
    }

    const titulosSecao = { livros: 'Controle de Livros', alunos: 'Controle de Alunos', reservas: 'Controle de Reservas' }

    const abrirModalLivro = (livro = null) => {
        setLivroEdit(livro)
        setShowModalLivro(true)
    }

    const handleSalvarLivro = async (e) => {
        e.preventDefault()
        const form = e.target
        const data = {
            titulo: form.titulo.value, autor: form.autor.value, editora: form.editora.value,
            genero: form.genero.value, idioma: form.idioma.value, ano_publicacao: form.ano_publicacao.value,
            isbn: form.isbn.value, caminho_capa: form.caminho_capa.value, sinopse: form.sinopse.value,
            ativo: form.ativo.checked
        }
        try {
            if (livroEdit?.id) { await atualizarLivro(livroEdit.id, data) }
            else { await criarLivro(data) }
            setShowModalLivro(false)
            carregarDados()
        } catch (err) { alert(err.response?.data?.mensagem || 'Erro ao salvar livro.') }
    }

    const handleExcluirLivro = async (id) => {
        if (!confirm('Excluir este livro?')) return
        try { await deletarLivro(id); carregarDados() }
        catch (err) { alert(err.response?.data?.mensagem || 'Erro ao excluir.') }
    }

    const handleExcluirAluno = async (id) => {
        if (!confirm('Excluir este aluno?')) return
        try { await deleteUsuario(id); carregarDados() }
        catch (err) { alert(err.response?.data?.mensagem || 'Erro ao excluir.') }
    }

    const handleConfirmarReserva = async (id) => {
        try { await confirmarReserva(id); carregarDados() }
        catch (err) { alert(err.response?.data?.mensagem || 'Erro ao confirmar.') }
    }

    const handleSair = () => {
        localStorage.clear()
        navigate('/login')
    }

    const livrosFiltrados = livros.filter(l => {
        const t = busca.toLowerCase()
        return !t || (l.titulo || '').toLowerCase().includes(t) || (l.autor || '').toLowerCase().includes(t) || (l.genero || '').toLowerCase().includes(t)
    })

    const alunosFiltrados = alunos.filter(a => {
        const t = busca.toLowerCase()
        return !t || (a.nome || '').toLowerCase().includes(t) || (a.email || '').toLowerCase().includes(t)
    })

    return (
        <div className="admin-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src="/images/LogoBibliotec.png" alt="Logo" className="admin-logo" />
                    <h3>Painel do Admin</h3>
                    <button className="dark-mode-toggle" id="dark-mode-btn" title="Modo escuro" type="button" onClick={darkMode.toggle}>
                        {darkMode.isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <a href="#" className={`nav-link${secao === 'livros' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setSecao('livros') }}>📚 Livros</a>
                    <a href="#" className={`nav-link${secao === 'alunos' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setSecao('alunos') }}>🎓 Alunos</a>
                    <a href="#" className={`nav-link${secao === 'reservas' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setSecao('reservas') }}>📅 Reservas</a>
                    <Link to="/" style={{ marginTop: 40, textDecoration: 'none' }}>🏠 Ver Site</Link>
                    <a href="#" id="btnSairAdmin" onClick={(e) => { e.preventDefault(); handleSair() }}>🚪 Sair</a>
                </nav>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <h2 id="tituloSecao">{titulosSecao[secao]}</h2>
                    <div className="user-info"><span id="adminNome">{adminNome}</span></div>
                </header>

                {/* SEÇÃO LIVROS */}
                {secao === 'livros' && (
                    <section className="content-section">
                        <div className="actions-bar">
                            <input type="text" id="buscaLivro" placeholder="Filtrar por nome, categoria ou autor..." value={busca} onChange={(e) => setBusca(e.target.value)} />
                            <button className="btn-novo" type="button" onClick={() => abrirModalLivro()}>+ Novo Livro</button>
                        </div>
                        <div className="table-responsive">
                            <table className="tabela-admin">
                                <thead><tr><th>ID</th><th>Capa</th><th>Título</th><th>Autor</th><th>Status</th><th>Ações</th></tr></thead>
                                <tbody>
                                    {livrosFiltrados.map(l => (
                                        <tr key={l.id}>
                                            <td>{l.id}</td>
                                            <td><img className="mini-capa" src={l.caminho_capa || '/images/capa-default.jpg'} alt={l.titulo} onError={(e) => { e.currentTarget.src = '/images/capa-default.jpg' }} /></td>
                                            <td>{l.titulo}</td>
                                            <td>{l.autor}</td>
                                            <td><span className={`badge-status ${l.ativo !== false ? 'ativo' : 'inativo'}`}>{l.ativo !== false ? 'Ativo' : 'Inativo'}</span></td>
                                            <td>
                                                <button className="btn-editar" type="button" onClick={() => abrirModalLivro(l)}>✏️</button>
                                                <button className="btn-excluir" type="button" onClick={() => handleExcluirLivro(l.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* SEÇÃO ALUNOS */}
                {secao === 'alunos' && (
                    <section className="content-section">
                        <div className="actions-bar">
                            <input type="text" placeholder="Buscar aluno..." className="search-admin" value={busca} onChange={(e) => setBusca(e.target.value)} />
                        </div>
                        <div className="table-responsive">
                            <table className="tabela-admin">
                                <thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Curso</th><th>Celular</th><th>Ações</th></tr></thead>
                                <tbody>
                                    {alunosFiltrados.map(a => (
                                        <tr key={a.id}>
                                            <td>{a.id}</td>
                                            <td>{a.nome}</td>
                                            <td>{a.email}</td>
                                            <td>{a.curso}</td>
                                            <td>{a.celular}</td>
                                            <td><button className="btn-excluir" type="button" onClick={() => handleExcluirAluno(a.id)}>🗑️</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* SEÇÃO RESERVAS */}
                {secao === 'reservas' && (
                    <section className="content-section">
                        <div className="table-responsive">
                            <table className="tabela-admin">
                                <thead><tr><th>ID</th><th>Aluno</th><th>Livro</th><th>Retirada</th><th>Devolução</th><th>Status</th><th>Ações</th></tr></thead>
                                <tbody>
                                    {reservas.map(r => (
                                        <tr key={r.id}>
                                            <td>{r.id}</td>
                                            <td>{r.usuario_nome || r.usuario_id}</td>
                                            <td>{r.livro_titulo || r.livro_id}</td>
                                            <td>{r.data_retirada ? new Date(r.data_retirada).toLocaleDateString('pt-BR') : 'N/A'}</td>
                                            <td>{r.data_devolucao ? new Date(r.data_devolucao).toLocaleDateString('pt-BR') : 'N/A'}</td>
                                            <td>{r.confirmado_email ? '✅ Confirmado' : '⏳ Pendente'}</td>
                                            <td>
                                                {!r.confirmado_email && <button className="btn-confirmar" type="button" onClick={() => handleConfirmarReserva(r.id)}>✅</button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {/* MODAL LIVRO */}
            {showModalLivro && (
                <div className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h3>{livroEdit ? 'Editar Livro' : 'Novo Livro'}</h3>
                        <form onSubmit={handleSalvarLivro}>
                            <div className="form-group"><label>Título (Nome)*</label><input type="text" name="titulo" defaultValue={livroEdit?.titulo || ''} required /></div>
                            <div className="form-row">
                                <div className="form-group"><label>Escritor (Autor)*</label><input type="text" name="autor" defaultValue={livroEdit?.autor || ''} required /></div>
                                <div className="form-group"><label>Editora</label><input type="text" name="editora" defaultValue={livroEdit?.editora || ''} /></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label>Categoria (Gênero)</label><input type="text" name="genero" defaultValue={livroEdit?.genero || ''} /></div>
                                <div className="form-group"><label>Idioma</label><input type="text" name="idioma" defaultValue={livroEdit?.idioma || 'Português'} /></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label>Ano</label><input type="number" name="ano_publicacao" defaultValue={livroEdit?.ano_publicacao || ''} /></div>
                                <div className="form-group"><label>ISBN</label><input type="text" name="isbn" defaultValue={livroEdit?.isbn || ''} /></div>
                            </div>
                            <div className="form-group"><label>Foto (URL da Capa)</label><input type="text" name="caminho_capa" defaultValue={livroEdit?.caminho_capa || ''} /></div>
                            <div className="form-group"><label>Descrição (Sinopse)</label><textarea name="sinopse" rows="3" defaultValue={livroEdit?.sinopse || ''} /></div>
                            <div className="form-group"><label><input type="checkbox" name="ativo" defaultChecked={livroEdit?.ativo !== false} /> Livro Ativo</label></div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancelar" onClick={() => setShowModalLivro(false)}>Cancelar</button>
                                <button type="submit" className="btn-salvar">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
