import { useMemo } from 'react'
import { CapsuleTab } from '../components/CapsuleTab'
import { LooksTab } from '../components/LooksTab'
import { TabNav } from '../components/TabNav'
import { useBody } from '../hooks/useBody'
import { useContrast } from '../hooks/useContrast'
import { routeHref } from '../hooks/useHashRoute'
import type { Route } from '../hooks/useHashRoute'
import { usePieces } from '../hooks/usePieces'
import { buildLooks } from '../lib/looks'
import type { StyleProfile } from '../lib/looks'

interface LooksPageProps {
  route: Extract<Route, 'looks' | 'looks-capsula'>
}

export function LooksPage({ route }: LooksPageProps) {
  const { pieces, loading: loadingPieces } = usePieces()
  const contrast = useContrast()
  const body = useBody()
  const loading = loadingPieces || contrast.loading || body.loading

  const profile: StyleProfile = useMemo(
    () => ({ contrastLevel: contrast.result?.level ?? null, shape: body.result?.shape ?? null }),
    [contrast.result?.level, body.result?.shape],
  )
  const looks = useMemo(() => (loading ? [] : buildLooks(pieces, profile)), [loading, pieces, profile])

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold tracking-[-0.03em] text-papaya-whip">Looks</h1>
      </div>

      <TabNav
        label="Partes de looks"
        tabs={[
          { href: routeHref.looks, label: 'Looks', active: route === 'looks' },
          { href: routeHref['looks-capsula'], label: 'Cápsula', active: route === 'looks-capsula' },
        ]}
      />

      {loading ? (
        <p className="text-steel-blue-700">Carregando…</p>
      ) : route === 'looks' ? (
        <LooksTab pieces={pieces} looks={looks} profile={profile} />
      ) : (
        <CapsuleTab pieces={pieces} looks={looks} profile={profile} />
      )}
    </>
  )
}
