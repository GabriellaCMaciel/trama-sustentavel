import { BodyTab } from '../components/BodyTab'
import { ContrastTab } from '../components/ContrastTab'
import { TabNav } from '../components/TabNav'
import { routeHref } from '../hooks/useHashRoute'
import type { Route } from '../hooks/useHashRoute'

interface ProfilePageProps {
  route: Extract<Route, 'perfil-contraste' | 'perfil-corpo'>
}

export function ProfilePage({ route }: ProfilePageProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold tracking-[-0.03em] text-papaya-whip">
          Meu perfil
        </h1>
      </div>

      <TabNav
        label="Partes do perfil"
        tabs={[
          { href: routeHref['perfil-contraste'], label: 'Contraste', active: route === 'perfil-contraste' },
          { href: routeHref['perfil-corpo'], label: 'Corpo', active: route === 'perfil-corpo' },
        ]}
      />

      {route === 'perfil-contraste' ? <ContrastTab /> : <BodyTab />}
    </>
  )
}
