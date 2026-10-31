# Trama Sustentável

Site que ajuda a pessoa a se vestir bem com o que já tem no guarda-roupa e a comprar só o que realmente multiplica seus looks. O nome é provisório.

## A ideia

- A pessoa cadastra fotos das suas roupas, acessórios e calçados.
- Informa o contraste do rosto (foto bem iluminada) e o formato do corpo, com guias.
- O sistema gera looks com as peças que ela tem e aponta as lacunas de um guarda-roupa cápsula.
- O objetivo é economizar e reduzir o desperdício têxtil, com muito estilo.

Detalhes de visão, escopo do MVP e decisões técnicas estão em [`docs/produto.md`](docs/produto.md).

## Status

Em desenvolvimento. Já funcionam o cadastro de peças do guarda-roupa e a descoberta do contraste pessoal (detalhes em [`docs/contraste.md`](docs/contraste.md)).

## Tecnologias

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (paleta própria em `src/index.css`)
- Oxlint
- Fontes Urbanist e Instrument Sans (via Fontsource)
- git-cliff para gerar o changelog
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
npm run changelog  # gera o CHANGELOG.md a partir dos commits
```

## Changelog

O histórico de mudanças está em [`CHANGELOG.md`](CHANGELOG.md). Ele é gerado a partir das mensagens de commit (padrão Conventional Commits) e atualizado sozinho pelo GitHub Actions a cada push na `main`.

## Privacidade

As fotos ficam no aparelho da pessoa. Nada é enviado a um servidor nesta primeira versão.
