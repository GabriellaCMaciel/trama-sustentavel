# Trama Sustentável

Site que ajuda a pessoa a se vestir bem com o que já tem no guarda-roupa e a comprar só o que realmente multiplica seus looks. O nome é provisório.

## A ideia

- A pessoa cadastra fotos das suas roupas, acessórios e calçados.
- Informa o contraste do rosto (foto bem iluminada) e o formato do corpo, com guias.
- O sistema gera looks com as peças que ela tem e aponta as lacunas de um guarda-roupa cápsula.
- O objetivo é economizar e reduzir o desperdício têxtil, com muito estilo.

Detalhes de visão, escopo do MVP e decisões técnicas estão em [`docs/produto.md`](docs/produto.md).

## Status

Em desenvolvimento. Primeira funcionalidade: cadastro de peças do guarda-roupa.

## Tecnologias

- React 19 + TypeScript
- Vite
- Oxlint
- Fontes Bodoni Moda e Instrument Sans (via Fontsource)
- Armazenamento local no navegador (IndexedDB), sem servidor

## Como rodar

Requisitos: Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Outros comandos:

```bash
npm run build    # verifica os tipos e gera a versão de produção
npm run lint     # roda o Oxlint
npm run preview  # abre a versão de produção localmente
```

## Privacidade

As fotos ficam no aparelho da pessoa. Nada é enviado a um servidor nesta primeira versão.
