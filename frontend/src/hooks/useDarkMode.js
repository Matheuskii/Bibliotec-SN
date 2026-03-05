import { useEffect, useMemo, useState } from 'react'

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('DarkMode') === 'true')

  useEffect(() => {
    const html = document.documentElement
    if (isDarkMode) html.classList.add('dark-mode')
    else html.classList.remove('dark-mode')
    localStorage.setItem('DarkMode', String(isDarkMode))
  }, [isDarkMode])

  return useMemo(
    () => ({
      isDarkMode,
      enable: () => setIsDarkMode(true),
      disable: () => setIsDarkMode(false),
      toggle: () => setIsDarkMode((v) => !v),
    }),
    [isDarkMode],
  )
}

