import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { getReservas, deleteReserva } from '../services/api'

export default function Reservas() {
  const [reservas, setReservas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      try {
        setIsLoading(true)
        const response = await getReservas()
        const lista = Array.isArray(response?.dados) ? response.dados : []
        if (!cancelado) setReservas(lista)
      } catch (err) {
        if (!cancelado) setError(err)
      } finally {
        if (!cancelado) setIsLoading(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [])

  const handleCancelar = async (id) => {
    try {
      await deleteReserva(id)
      setReservas((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
      alert('Erro ao cancelar reserva.')
    }
  }

  return (
    <Layout>
      <main className="reservas-wrapper">
        <h2 className="titulo-secao">Minhas Reservas ( ﾟヮﾟ)</h2>

        <table className="tabela-reservas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Livro</th>
              <th>Retirada</th>
              <th>Devolução</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="gridReservas">
            {isLoading && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>
                  Carregando suas reservas...
                </td>
              </tr>
            )}
            {error && !isLoading && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>
                  Erro ao carregar reservas.
                </td>
              </tr>
            )}
            {!isLoading && !error && reservas.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>
                  Nenhuma reserva encontrada.
                </td>
              </tr>
            )}
            {!isLoading &&
              !error &&
              reservas.map((reserva) => {
                const retirada = reserva.data_retirada
                  ? new Date(reserva.data_retirada).toLocaleDateString('pt-BR')
                  : 'N/A'
                const devolucao = reserva.data_devolucao
                  ? new Date(reserva.data_devolucao).toLocaleDateString('pt-BR')
                  : 'N/A'

                return (
                  <tr key={reserva.id}>
                    <td>{reserva.id ?? 'N/A'}</td>
                    <td>{reserva.usuario_nome ?? `ID: ${reserva.usuario_id ?? 'N/A'}`}</td>
                    <td>{reserva.livro_titulo ?? `ID: ${reserva.livro_id ?? 'N/A'}`}</td>
                    <td>{retirada}</td>
                    <td>{devolucao}</td>
                    <td>{reserva.confirmado_email ? '✅' : '⏳'}</td>
                    <td>
                      <button type="button" className="btn-cancelar" onClick={() => handleCancelar(reserva.id)}>
                        Cancelar
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </main>
    </Layout>
  )
}

