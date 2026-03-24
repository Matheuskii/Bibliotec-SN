import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { getBookById, getAvaliacoes, postAvaliacao, criarReserva, addFavorito } from '../services/api'

export default function DetalhesLivro() {
    const { id } = useParams()
    const [livro, setLivro] = useState(null)
    const [avaliacoes, setAvaliacoes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModalReserva, setShowModalReserva] = useState(false)
    const [dataDevolucao, setDataDevolucao] = useState('')
    const [showFormAvaliacao, setShowFormAvaliacao] = useState(false)
    const [nota, setNota] = useState(0)
    const [comentario, setComentario] = useState('')

    useEffect(() => {
        async function carregar() {
            try {
                setIsLoading(true)
                const livroData = await getBookById(id)
                setLivro(Array.isArray(livroData) ? livroData[0] : livroData)
                try {
                    const avData = await getAvaliacoes(id)
                    setAvaliacoes(Array.isArray(avData) ? avData : [])
                } catch { setAvaliacoes([]) }
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        carregar()
    }, [id])

    const mediaNotas = avaliacoes.length > 0
        ? (avaliacoes.reduce((acc, a) => acc + Number(a.nota || 0), 0) / avaliacoes.length).toFixed(1)
        : '0.0'

    const estrelasMedia = Math.round(Number(mediaNotas))

    const handleReservar = async () => {
        const usuarioId = localStorage.getItem('usuarioId')
        if (!usuarioId) { alert('Faça login para reservar.'); return }
        if (!dataDevolucao) { alert('Selecione uma data de devolução.'); return }
        try {
            await criarReserva({ livro_id: id, usuario_id: usuarioId, data_devolucao: dataDevolucao })
            alert('Reserva realizada com sucesso!')
            setShowModalReserva(false)
        } catch (err) {
            alert(err.response?.data?.mensagem || 'Erro ao reservar.')
        }
    }

    const handleFavoritar = async () => {
        const usuarioId = localStorage.getItem('usuarioId')
        if (!usuarioId) { alert('Faça login para favoritar.'); return }
        try {
            await addFavorito({ usuario_id: usuarioId, livro_id: id })
            alert('Adicionado aos favoritos!')
        } catch (err) {
            alert(err.response?.data?.mensagem || 'Erro ao favoritar.')
        }
    }

    const handleEnviarAvaliacao = async () => {
        const usuarioId = localStorage.getItem('usuarioId')
        if (!usuarioId) { alert('Faça login para avaliar.'); return }
        if (nota === 0) { alert('Selecione uma nota.'); return }
        try {
            await postAvaliacao({ livro_id: id, usuario_id: usuarioId, nota, comentario })
            alert('Avaliação publicada!')
            setShowFormAvaliacao(false)
            setNota(0)
            setComentario('')
            const avData = await getAvaliacoes(id)
            setAvaliacoes(Array.isArray(avData) ? avData : [])
        } catch (err) {
            alert(err.response?.data?.mensagem || 'Erro ao avaliar.')
        }
    }

    if (isLoading) {
        return <Layout><div className="container-detalhes"><div className="loading">Carregando informações do livro...</div></div></Layout>
    }

    if (!livro) {
        return <Layout><div className="container-detalhes"><p>Livro não encontrado.</p></div></Layout>
    }

    let capa = livro.caminho_capa || livro.capa_url || '/images/capa-default.jpg'

    if (capa && !capa.startsWith('http') && !capa.startsWith('/') && !capa.startsWith('data:')) {
        capa = `/capas/${capa}`
    } else if (capa && !capa.startsWith('http') && capa.startsWith('/') && !capa.startsWith('/capas/') && !capa.startsWith('/images/')) {
        capa = `/capas${capa}`
    }

    return (
        <Layout>
            <div className="container-detalhes" id="detalhes-container">
                <Link to="/catalogo" className="btn-voltar">← Voltar ao catálogo</Link>

                <div className="background-detalhes">
                    <div className="background-livro">
                        <div className="capa-container">
                            <img src={capa} alt={livro.titulo} onError={(e) => { e.currentTarget.src = '/images/capa-default.jpg' }} />
                        </div>

                        <div className="info-container">
                            <h1>{livro.titulo || 'Sem título'}</h1>
                            <p className="autor">{livro.autor || 'Autor desconhecido'}</p>

                            <div className="meta-info-grid">
                                {livro.editora && <div className="meta-item"><strong>📚 Editora</strong><span>{livro.editora}</span></div>}
                                {livro.genero && <div className="meta-item"><strong>🏷️ Gênero</strong><span>{livro.genero}</span></div>}
                                {livro.idioma && <div className="meta-item"><strong>🌐 Idioma</strong><span>{livro.idioma}</span></div>}
                                {livro.ano_publicacao && <div className="meta-item"><strong>📅 Ano</strong><span>{livro.ano_publicacao}</span></div>}
                                {livro.isbn && <div className="meta-item"><strong>🔢 ISBN</strong><span>{livro.isbn}</span></div>}
                                <div className="meta-item">
                                    <strong>📊 Status</strong>
                                    <span className={`status ${livro.ativo !== false ? 'disponivel' : 'indisponivel'}`}>
                                        {livro.ativo !== false ? 'Disponível' : 'Indisponível'}
                                    </span>
                                </div>
                            </div>

                            <div className="acoes-livro">
                                <button className="btn-acao btn-reservar" type="button" onClick={() => setShowModalReserva(true)}>📅 Reservar</button>
                                <button className="btn-acao btn-favorito" type="button" onClick={handleFavoritar}>❤️ Favoritar</button>
                            </div>
                        </div>
                    </div>

                    {livro.sinopse && (
                        <div className="livro-body">
                            <div className="sinopse">
                                <h2>Sinopse</h2>
                                <p>{livro.sinopse}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Reserva */}
            {showModalReserva && (
                <div id="modalReserva" className="modal-overlay">
                    <div className="modal-content">
                        <h3>📅 Realizar Reserva</h3>
                        <p>Até quando você ficará com o livro?</p>
                        <div className="form-group">
                            <label htmlFor="dataDevolucao">Data de Devolução:</label>
                            <input type="date" id="dataDevolucao" className="input-data-reserva" value={dataDevolucao} onChange={(e) => setDataDevolucao(e.target.value)} />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancelar" type="button" onClick={() => setShowModalReserva(false)}>Cancelar</button>
                            <button className="btn-confirmar" type="button" onClick={handleReservar}>Confirmar Reserva</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Seção de Avaliações */}
            <div className="separador-secao"></div>
            <section className="comunidade-container">
                <div className="painel-media">
                    <h3>Opinião dos Leitores</h3>
                    <div className="media-display">
                        <span className="nota-gigante">{mediaNotas}</span>
                        <div className="detalhes-media">
                            <div className="estrelas-fixas">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <span key={i} style={{ color: i <= estrelasMedia ? '#ffd700' : undefined }}>★</span>
                                ))}
                            </div>
                            <span className="total-votos">Baseado em {avaliacoes.length} avaliações</span>
                        </div>
                    </div>
                </div>

                <div className="painel-comentarios">
                    <button className="btn-toggle-form" type="button" onClick={() => setShowFormAvaliacao(!showFormAvaliacao)}>
                        ✍️ Escrever uma avaliação
                    </button>

                    {showFormAvaliacao && (
                        <div className="card-avaliacao-form">
                            <h4>Sua avaliação:</h4>
                            <div className="estrelas-input">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <span key={i} className={`star-icon${i <= nota ? ' active' : ''}`} onClick={() => setNota(i)}>★</span>
                                ))}
                            </div>
                            <textarea id="comentarioInput" placeholder="Conte o que achou..." value={comentario} onChange={(e) => setComentario(e.target.value)} />
                            <button className="btn-enviar-review" type="button" onClick={handleEnviarAvaliacao}>Publicar</button>
                        </div>
                    )}

                    <div className="lista-reviews">
                        {avaliacoes.length === 0 && <p>Nenhuma avaliação ainda. Seja o primeiro!</p>}
                        {avaliacoes.map((av, idx) => (
                            <div key={av.id || idx} className="review-item">
                                <div className="review-header">
                                    <span className="review-autor">{av.usuario_nome || 'Anônimo'}</span>
                                    <span className="review-nota">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <span key={i} style={{ color: i <= Number(av.nota) ? '#ffd700' : '#e0e0e0' }}>★</span>
                                        ))}
                                    </span>
                                </div>
                                <p className="review-texto">{av.comentario}</p>
                                {av.data_criacao && <span className="review-data">{new Date(av.data_criacao).toLocaleDateString('pt-BR')}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    )
}
