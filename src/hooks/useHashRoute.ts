import { useEffect, useState } from 'react'

export type Route = 'inicio' | 'guarda-roupa' | 'perfil-contraste' | 'perfil-corpo'

export const routeHref: Record<Route, string> = {
  inicio: '#/',
  'guarda-roupa': '#/guarda-roupa',
  'perfil-contraste': '#/meu-perfil/contraste',
  'perfil-corpo': '#/meu-perfil/corpo',
}

function readRoute(): Route {
  const hash = window.location.hash
  if (hash === routeHref['guarda-roupa']) return 'guarda-roupa'
  if (hash === routeHref['perfil-corpo']) return 'perfil-corpo'
  // "#/meu-perfil" sem aba e o endereço antigo "#/meu-contraste" abrem a aba Contraste.
  if (hash === routeHref['perfil-contraste'] || hash === '#/meu-perfil' || hash === '#/meu-contraste') {
    return 'perfil-contraste'
  }
  return 'inicio'
}

/**
 * Navegação simples pelo endereço (#/guarda-roupa), sem servidor.
 * Funciona também no GitHub Pages.
 */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    function handleChange() {
      const next = readRoute()
      setRoute((previous) => {
        // Trocar de aba dentro do perfil não leva a página para o topo.
        const sameProfile = previous.startsWith('perfil') && next.startsWith('perfil')
        if (!sameProfile) window.scrollTo({ top: 0 })
        return next
      })
    }
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  return route
}
