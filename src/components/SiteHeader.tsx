import { routeHref } from '../hooks/useHashRoute'
import type { Route } from '../hooks/useHashRoute'
import { HangerIcon } from './Icons'

interface SiteHeaderProps {
  route: Route
}

const LINKS: { route: Route; label: string }[] = [
  { route: 'inicio', label: 'Início' },
  { route: 'guarda-roupa', label: 'Meu guarda-roupa' },
]

export function SiteHeader({ route }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href={routeHref.inicio}>
          <HangerIcon className="brand-mark" />
          <span>Trama Sustentável</span>
        </a>
        <nav aria-label="Principal">
          <ul className="nav-list">
            {LINKS.map((link) => (
              <li key={link.route}>
                <a
                  className="nav-link"
                  href={routeHref[link.route]}
                  aria-current={route === link.route ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
