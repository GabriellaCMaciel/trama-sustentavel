import { SiteHeader } from './components/SiteHeader'
import { useHashRoute } from './hooks/useHashRoute'
import { HomePage } from './pages/HomePage'
import { WardrobePage } from './pages/WardrobePage'

export default function App() {
  const route = useHashRoute()

  return (
    <>
      <SiteHeader route={route} />
      <main className="mx-auto max-w-[1120px] px-4 pt-10 pb-20 min-[880px]:px-8 min-[880px]:pt-14 min-[880px]:pb-24">
        {route === 'guarda-roupa' ? <WardrobePage /> : <HomePage />}
      </main>
      <footer className="border-t border-steel-blue-300 px-4 pt-6 pb-10 text-center text-sm text-steel-blue-700">
        <p>Trama Sustentável é um projeto em desenvolvimento.</p>
      </footer>
    </>
  )
}
