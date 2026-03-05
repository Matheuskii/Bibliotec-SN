import { useEffect, useMemo, useState } from 'react'
import { listarLivros } from '../services/livros'

export function useLivros() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    listarLivros()
      .then((livros) => {
        if (!cancelled) setData(livros)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => ({ data, isLoading, error }), [data, isLoading, error])
}

