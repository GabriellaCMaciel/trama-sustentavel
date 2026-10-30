import { useEffect, useState } from 'react'

export type Route = 'inicio' | 'guarda-roupa'

function readRoute(): Route {
  return window.location.hash === '#/guarda-roupa' ? 'guarda-roupa' : 'inicio'
}

/**
 * Navegação simples pelo endereço (#/guarda-roupa), sem servidor.
 * Funciona também no GitHub Pages.
 */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    function handleChange() {
      setRoute(readRoute())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  return route
}

export const routeHref: Record<Route, string> = {
  inicio: '#/',
  'guarda-roupa': '#/guarda-roupa',
}
