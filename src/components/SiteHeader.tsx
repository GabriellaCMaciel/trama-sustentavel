import { routeHref } from '../hooks/useHashRoute'
import type { Route } from '../hooks/useHashRoute'
import { HangerIcon } from './Icons'

interface SiteHeaderProps {
  route: Route
}

const LINKS: { href: string; label: string; isActive: (route: Route) => boolean }[] = [
  { href: routeHref.inicio, label: 'Início', isActive: (route) => route === 'inicio' },
  { href: routeHref['guarda-roupa'], label: 'Meu guarda-roupa', isActive: (route) => route === 'guarda-roupa' },
  { href: routeHref['perfil-contraste'], label: 'Meu perfil', isActive: (route) => route.startsWith('perfil') },
  { href: routeHref.looks, label: 'Looks', isActive: (route) => route.startsWith('looks') },
]

export function SiteHeader({ route }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-steel-blue-300 bg-deep-space-blue-200/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 min-[880px]:px-8 min-[880px]:py-3.5">
        <a
          className="inline-flex items-center gap-2.5 font-display text-lg font-bold text-papaya-whip no-underline"
          href={routeHref.inicio}
        >
          <HangerIcon className="w-7.5 text-brick-red-700" />
          <span>Trama Sustentável</span>
        </a>
        <nav aria-label="Principal" className="w-full min-[400px]:w-auto">
          {/* Abaixo de 400 px, os quatro links ficam em duas linhas de dois, com a mesma largura. */}
          <ul className="grid grid-cols-2 gap-1 min-[400px]:flex min-[400px]:gap-0.5 min-[480px]:gap-1">
            {LINKS.map((link) => {
              const active = link.isActive(route)
              return (
                <li key={link.href}>
                  <a
                    className={`block rounded-full px-2 py-1.5 text-center text-sm min-[400px]:inline-block font-medium whitespace-nowrap no-underline transition-colors min-[360px]:px-2.5 min-[360px]:text-[0.9375rem] min-[480px]:px-3.5 min-[480px]:py-2 min-[480px]:text-base ${
                      active
                        ? 'bg-papaya-whip text-deep-space-blue-200'
                        : 'text-steel-blue-700 hover:text-papaya-whip'
                    }`}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
