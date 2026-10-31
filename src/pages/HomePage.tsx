import { routeHref } from '../hooks/useHashRoute'
import { buttonLight, buttonPrimary, buttonSecondary, sectionTitle } from '../ui'

const STEPS = [
  {
    title: 'Cadastre suas peças',
    text: 'Fotografe roupas, calçados e acessórios. Tudo fica salvo só neste aparelho.',
    available: true,
  },
  {
    title: 'Descubra seu contraste',
    text: 'Com uma foto do rosto em luz natural, o site indica se seu contraste é baixo, médio ou alto e quais combinações de cor valorizam você.',
    available: false,
  },
  {
    title: 'Entenda o formato do seu corpo',
    text: 'Um guia com medidas simples mostra seu formato e os cortes que costumam favorecer.',
    available: false,
  },
  {
    title: 'Receba looks e sua cápsula',
    text: 'O site combina as peças que você tem, monta um guarda-roupa cápsula e aponta as poucas compras que mais aumentariam suas combinações.',
    available: false,
  },
]

const REASONS = [
  {
    title: 'Gaste menos',
    text: 'Antes de comprar, você vê quantos looks já consegue montar com o que tem.',
  },
  {
    title: 'Desperdice menos',
    text: 'Roupa usada por mais tempo não vira lixo têxtil. A ordem é usar, consertar, trocar ou comprar em brechó, e só depois comprar nova.',
  },
  {
    title: 'Vista-se com intenção',
    text: 'Cores e cortes escolhidos para você, não para a tendência da semana.',
  },
]

/** Peças de exemplo da ilustração da abertura. */
const SAMPLE_TAGS = [
  { name: 'Camisa de linho', category: 'Parte de cima', swatch: 'bg-papaya-whip', tilt: -1.5 },
  { name: 'Calça de alfaiataria', category: 'Parte de baixo', swatch: 'bg-deep-space-blue', tilt: 1.5 },
  { name: 'Mocassim', category: 'Calçado', swatch: 'bg-brick-red', tilt: -1 },
]

export function HomePage() {
  return (
    <>
      <section className="grid items-center gap-12 pt-6 pb-18 min-[880px]:grid-cols-[1.15fr_1fr] min-[880px]:pb-24 [&>*]:min-w-0">
        <div>
          <h1 className="max-w-[14ch] text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] font-extrabold tracking-[-0.035em] text-papaya-whip">
            Monte looks com as roupas que você já tem.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[1.1875rem] leading-relaxed text-steel-blue-700">
            Cadastre suas peças, descubra o contraste do seu rosto e o formato do seu corpo, e receba
            combinações e um guarda-roupa cápsula. Você só compra o que realmente aumenta seus looks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className={buttonPrimary} href={routeHref['guarda-roupa']}>
              Montar meu guarda-roupa
            </a>
            <button
              type="button"
              className={buttonSecondary}
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver como funciona
            </button>
          </div>
        </div>

        <figure>
          {/* Arara com etiquetas de exemplo */}
          <ul
            className="grid grid-cols-3 gap-[clamp(22px,3vw,26px)] rounded-xs border-t-[3px] border-brick-red pt-8.5"
            aria-hidden="true"
          >
            {SAMPLE_TAGS.map((tag) => (
              <li key={tag.name} className="relative flex origin-top flex-col" style={{ rotate: `${tag.tilt}deg` }}>
                <span className="absolute -top-8.5 left-1/2 h-8.5 w-[1.5px] bg-brick-red" />
                <div className={`aspect-[3/4] rounded-t-[10px] ring-1 ring-papaya-whip/15 ring-inset ${tag.swatch}`} />
                <div className="clip-tag relative grid gap-1.5 bg-papaya-whip px-3.5 pt-7 pb-4.5 text-deep-space-blue-200">
                  <span className="absolute top-2.5 left-[calc(50%-4.5px)] size-2.25 rounded-full bg-deep-space-blue-200 ring-2 ring-brick-red" />
                  <span className="font-display text-[clamp(0.8125rem,2.6vw,1rem)] leading-tight font-bold [overflow-wrap:anywhere] hyphens-auto">
                    {tag.name}
                  </span>
                  <span className="text-[0.8125rem] text-deep-space-blue">{tag.category}</span>
                </div>
              </li>
            ))}
          </ul>
          <figcaption className="mt-4 text-sm text-steel-blue-700">
            Exemplo: três peças que já estão no armário e formam um look.
          </figcaption>
        </figure>
      </section>

      <section id="como-funciona" className="border-t border-steel-blue-300 py-14" aria-labelledby="steps-title">
        <h2 id="steps-title" className={`${sectionTitle} mb-8`}>
          Como funciona
        </h2>
        <ol className="grid gap-4 min-[700px]:grid-cols-2">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="grid grid-rows-[auto_auto_1fr_auto] gap-2.5 rounded-2xl border border-steel-blue-300 bg-deep-space-blue p-6"
            >
              <span
                className="grid size-10 place-items-center rounded-full bg-brick-red font-display text-xl font-extrabold text-papaya-whip"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <h3 className="text-xl text-papaya-whip">{step.title}</h3>
              <p className="text-steel-blue-800">{step.text}</p>
              <span
                className={`justify-self-start rounded-full px-2.5 py-0.75 text-[0.8125rem] font-semibold ${
                  step.available
                    ? 'bg-papaya-whip text-deep-space-blue-200'
                    : 'bg-steel-blue-300 text-papaya-whip'
                }`}
              >
                {step.available ? 'Disponível' : 'Em breve'}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-steel-blue-300 py-14" aria-labelledby="why-title">
        <h2 id="why-title" className={`${sectionTitle} mb-8`}>
          Por que usar
        </h2>
        <div className="grid gap-8 min-[700px]:grid-cols-3">
          {REASONS.map((reason) => (
            <div key={reason.title} className="border-l-[3px] border-brick-red pl-4.5">
              <h3 className="mb-2 text-[1.375rem] text-papaya-whip">{reason.title}</h3>
              <p className="text-steel-blue-700">{reason.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mt-6 grid items-center gap-6 rounded-[20px] bg-molten-lava p-8 min-[700px]:grid-cols-[1fr_auto] min-[700px]:px-12 min-[700px]:py-10"
        aria-labelledby="privacy-title"
      >
        <div>
          <h2 id="privacy-title" className={`${sectionTitle} mb-2`}>
            Suas fotos ficam com você
          </h2>
          <p className="text-steel-blue-800">
            Nesta versão, nada é enviado para servidor. As fotos e as peças ficam guardadas no navegador do
            seu aparelho, e você pode apagar tudo quando quiser.
          </p>
        </div>
        <a className={`${buttonLight} justify-self-start`} href={routeHref['guarda-roupa']}>
          Começar pelo guarda-roupa
        </a>
      </section>
    </>
  )
}
