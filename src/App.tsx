import { SiteHeader } from './components/SiteHeader'
import { useHashRoute } from './hooks/useHashRoute'
import { HomePage } from './pages/HomePage'
import { WardrobePage } from './pages/WardrobePage'
import './App.css'

export default function App() {
  const route = useHashRoute()

  return (
    <>
      <SiteHeader route={route} />
      <main className="app">{route === 'guarda-roupa' ? <WardrobePage /> : <HomePage />}</main>
      <footer className="site-footer">
        <p>Trama Sustentável é um projeto em desenvolvimento.</p>
      </footer>
    </>
  )
}
