interface SiteFooterProps {
  aviso: string
  autor: string
  autorUrl: string
}

export function SiteFooter({ aviso, autor, autorUrl }: SiteFooterProps) {
  return (
    <footer className="border-t border-steel-blue-300 px-4 pt-6 pb-10 text-center text-sm text-steel-blue-700">
      <p>{aviso}</p>
      <p className="mt-1">
        Desenvolvido por{' '}
        <a
          className="font-semibold text-papaya-whip underline-offset-4 hover:underline"
          href={autorUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {autor}
        </a>
      </p>
    </footer>
  )
}
