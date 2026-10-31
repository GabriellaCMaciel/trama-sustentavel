import { useEffect, useState } from 'react'

export type Route = 'inicio' | 'guarda-roupa' | 'perfil-contraste' | 'perfil-corpo' | 'looks' | 'looks-capsula'

export const routeHref: Record<Route, string> = {
  inicio: '#/',
  'guarda-roupa': '#/guarda-roupa',
  'perfil-contraste': '#/meu-perfil/contraste',
  'perfil-corpo': '#/meu-perfil/corpo',
  looks: '#/looks',
  'looks-capsula': '#/looks/capsula',
}

function readRoute(): Route {
  const hash = window.location.hash
  if (hash === routeHref['guarda-roupa']) return 'guarda-roupa'
  if (hash === routeHref['perfil-corpo']) return 'perfil-corpo'
  // "#/meu-perfil" sem aba e o endereço antigo "#/meu-contraste" abrem a aba Contraste.
  if (hash === routeHref['perfil-contraste'] || hash === '#/meu-perfil' || hash === '#/meu-contraste') {
    return 'perfil-contraste'
  }
  if (hash === routeHref['looks-capsula']) return 'looks-capsula'
  if (hash === routeHref.looks) return 'looks'
  return 'inicio'
}

/** Páginas com abas: trocar de aba dentro da mesma página não leva a página para o topo. */
function pageOf(route: Route) {
  return route.split('-')[0]
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
        const samePage = (previous.startsWith('perfil') || previous.startsWith('looks')) && pageOf(previous) === pageOf(next)
        if (!samePage) window.scrollTo({ top: 0 })
        return next
      })
    }
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  return route
}
