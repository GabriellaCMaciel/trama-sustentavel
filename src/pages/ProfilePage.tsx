import { BodyTab } from '../components/BodyTab'
import { ContrastTab } from '../components/ContrastTab'
import { routeHref } from '../hooks/useHashRoute'
import type { Route } from '../hooks/useHashRoute'

interface ProfilePageProps {
  route: Extract<Route, 'perfil-contraste' | 'perfil-corpo'>
}

const TABS: { route: ProfilePageProps['route']; label: string }[] = [
  { route: 'perfil-contraste', label: 'Contraste' },
  { route: 'perfil-corpo', label: 'Corpo' },
]

export function ProfilePage({ route }: ProfilePageProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold tracking-[-0.03em] text-papaya-whip">
          Meu perfil
        </h1>
      </div>

      <nav aria-label="Partes do perfil" className="mb-8 border-b border-steel-blue-300">
        <ul className="flex gap-6">
          {TABS.map((tab) => {
            const active = route === tab.route
            return (
              <li key={tab.route}>
                <a
                  href={routeHref[tab.route]}
                  aria-current={active ? 'page' : undefined}
                  className={`-mb-px inline-block border-b-[3px] px-1 pb-3 font-display text-xl font-bold no-underline transition-colors ${
                    active
                      ? 'border-brick-red text-papaya-whip'
                      : 'border-transparent text-steel-blue-700 hover:text-papaya-whip'
                  }`}
                >
                  {tab.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {route === 'perfil-contraste' ? <ContrastTab /> : <BodyTab />}
    </>
  )
}
