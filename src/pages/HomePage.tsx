import { routeHref } from '../hooks/useHashRoute'

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
  { name: 'Camisa de linho', category: 'Parte de cima', swatch: 'var(--blush-ivory)', tilt: -1.5 },
  { name: 'Calça de alfaiataria', category: 'Parte de baixo', swatch: 'var(--burgundy)', tilt: 1.5 },
  { name: 'Mocassim', category: 'Calçado', swatch: 'var(--antique-gold)', tilt: -1 },
]

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>Monte looks com as roupas que você já tem.</h1>
          <p className="hero-lead">
            Cadastre suas peças, descubra o contraste do seu rosto e o formato do seu corpo, e receba
            combinações e um guarda-roupa cápsula. Você só compra o que realmente aumenta seus looks.
          </p>
          <div className="hero-actions">
            <a className="primary" href={routeHref['guarda-roupa']}>
              Montar meu guarda-roupa
            </a>
            <button
              type="button"
              className="secondary"
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver como funciona
            </button>
          </div>
        </div>

        <figure className="hero-art">
          <div className="rail" aria-hidden="true">
            {SAMPLE_TAGS.map((tag) => (
              <div key={tag.name} className="rail-item" style={{ rotate: `${tag.tilt}deg` }}>
                <span className="rail-string" />
                <div className="sample-swatch" style={{ background: tag.swatch }} />
                <div className="piece-tag">
                  <span className="tag-hole" />
                  <span className="sample-name">{tag.name}</span>
                  <span className="sample-category">{tag.category}</span>
                </div>
              </div>
            ))}
          </div>
          <figcaption>Exemplo: três peças que já estão no armário e formam um look.</figcaption>
        </figure>
      </section>

      <section id="como-funciona" className="section" aria-labelledby="steps-title">
        <h2 id="steps-title">Como funciona</h2>
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="step">
              <span className="step-number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className={`status ${step.available ? 'is-available' : 'is-soon'}`}>
                {step.available ? 'Disponível' : 'Em breve'}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="why-title">
        <h2 id="why-title">Por que usar</h2>
        <div className="reasons">
          {REASONS.map((reason) => (
            <div key={reason.title} className="reason">
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="privacy" aria-labelledby="privacy-title">
        <div>
          <h2 id="privacy-title">Suas fotos ficam com você</h2>
          <p>
            Nesta versão, nada é enviado para servidor. As fotos e as peças ficam guardadas no navegador do
            seu aparelho, e você pode apagar tudo quando quiser.
          </p>
        </div>
        <a className="primary" href={routeHref['guarda-roupa']}>
          Começar pelo guarda-roupa
        </a>
      </section>
    </>
  )
}
