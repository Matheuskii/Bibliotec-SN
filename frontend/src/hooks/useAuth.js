import { useCallback, useMemo, useState } from 'react'

function readAuth() {
  const usuarioId = localStorage.getItem('usuarioId')
  const perfil = localStorage.getItem('perfilUsuario')
  return { usuarioId, perfil }
}

export function useAuth() {
  const [{ usuarioId, perfil }, setAuth] = useState(() => readAuth())

  const refresh = useCallback(() => setAuth(readAuth()), [])

  const logout = useCallback(() => {
    localStorage.clear()
    refresh()
  }, [refresh])

  return useMemo(
    () => ({
      usuarioId,
      perfil,
      isLoggedIn: Boolean(usuarioId),
      isAdmin: perfil === 'Admin',
      refresh,
      logout,
    }),
    [usuarioId, perfil, refresh, logout],
  )
}

