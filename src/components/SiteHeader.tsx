import { routeHref } from '../hooks/useHashRoute'
import type { Route } from '../hooks/useHashRoute'
import { HangerIcon } from './Icons'

interface SiteHeaderProps {
  route: Route
}

const LINKS: { route: Route; label: string }[] = [
  { route: 'inicio', label: 'Início' },
  { route: 'guarda-roupa', label: 'Meu guarda-roupa' },
  { route: 'contraste', label: 'Meu contraste' },
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
        <nav aria-label="Principal">
          <ul className="flex gap-0.5 min-[480px]:gap-1">
            {LINKS.map((link) => {
              const active = route === link.route
              return (
                <li key={link.route}>
                  <a
                    className={`inline-block rounded-full px-2 py-1.5 text-sm font-medium min-[360px]:px-2.5 min-[360px]:text-[0.9375rem] whitespace-nowrap no-underline transition-colors min-[480px]:px-3.5 min-[480px]:py-2 min-[480px]:text-base ${
                      active
                        ? 'bg-papaya-whip text-deep-space-blue-200'
                        : 'text-steel-blue-700 hover:text-papaya-whip'
                    }`}
                    href={routeHref[link.route]}
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
