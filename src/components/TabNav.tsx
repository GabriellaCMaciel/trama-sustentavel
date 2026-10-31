interface Tab {
  href: string
  label: string
  active: boolean
}

/** Abas de uma página (cada aba é um endereço, então dá para compartilhar e voltar). */
export function TabNav({ label, tabs }: { label: string; tabs: Tab[] }) {
  return (
    <nav aria-label={label} className="mb-8 border-b border-steel-blue-300">
      <ul className="flex gap-6">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <a
              href={tab.href}
              aria-current={tab.active ? 'page' : undefined}
              className={`-mb-px inline-block border-b-[3px] px-1 pb-3 font-display text-xl font-bold no-underline transition-colors ${
                tab.active
                  ? 'border-brick-red text-papaya-whip'
                  : 'border-transparent text-steel-blue-700 hover:text-papaya-whip'
              }`}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
