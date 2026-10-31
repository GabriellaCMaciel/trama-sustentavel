# Trama Sustentável: documentação do produto

Resumo do documento de produto escrito antes do código. Tudo que está marcado como "a validar" ainda não foi decidido.

## Visão

Um site que monta looks com as roupas que a pessoa já tem e só sugere compras quando uma peça nova multiplica as combinações.

**Promessa (proposta):** vista-se bem com o que você já tem e compre só o que multiplica seus looks.

## Problema

Muita gente tem o armário cheio e continua sem saber o que vestir. Isso leva a compras repetidas, a peças que não combinam com nada e a descarte de roupa que ainda serve.

## O que já existe

Há apps que cobrem partes da ideia, como armário digital, coloração pessoal, análise de corpo e cápsula. Nenhum dos que encontrei junta contraste, formato do corpo, armário real, cápsula, lista mínima de compras e sustentabilidade em um único fluxo. As informações vêm das descrições nas lojas de apps, sem teste.

## Escopo do MVP

Entra no MVP:

- Cadastro de peças por foto (roupas, acessórios, calçados) com categoria, cor e ocasião.
- Foto do rosto com guia de iluminação e resultado de contraste (baixo, médio, alto), com ajuste manual.
- Guia de formato do corpo por medidas ou questionário, sem exigir foto do corpo.
- Gerador de looks com as peças que a pessoa tem.
- Cápsula possível com o armário atual e lista das lacunas.
- Métrica simples de looks por peça.

Fica para depois:

- Remoção automática de fundo, envio em lote e cadastro por vídeo.
- Foto do corpo para análise de formato.
- Sugestões de peças novas com links e busca em brechós.
- Looks por clima e agenda.
- Provador virtual.
- Custo por uso e economia acumulada.
- Troca de peças entre usuários.

## Decisões técnicas

| Decisão | Escolha | Motivo |
| --- | --- | --- |
| Front-end | React + Vite | Escolha da autora do projeto |
| Linguagem | TypeScript | Ajuda a modelar peça, look e perfil e pega erros antes de rodar |
| Dados | Só no navegador (IndexedDB) | Sem servidor e sem conta; as fotos ficam no aparelho, o que combina com a privacidade |
| Primeira funcionalidade | Cadastro de peças | O armário é a base de looks, cápsula e lista de compras |
| Estilos | Tailwind CSS v4 | Escolha da autora do projeto; as cores da paleta viram classes como `bg-brick-red` e `text-papaya-whip` |
| Changelog | git-cliff + GitHub Actions | O `CHANGELOG.md` é gerado a partir dos commits e atualizado sozinho a cada push na `main` |

## Identidade visual

Tema escuro com a paleta abaixo, definida no `@theme` do Tailwind (`src/index.css`). Só essas cores existem no projeto: as cores padrão do Tailwind foram desligadas. Cada cor tem tons de 100 (mais escuro) a 900 (mais claro); o nome sem número é o tom 500.

| Cor | Classe no Tailwind | Código base | Uso no site |
| --- | --- | --- | --- |
| Deep Space Blue | `deep-space-blue` | `#003049` | Fundo da página (tom 200), painéis e cartões (tom base) |
| Papaya Whip | `papaya-whip` | `#FDF0D5` | Texto principal, etiquetas das peças e menu ativo |
| Steel Blue | `steel-blue` | `#669BBC` | Texto secundário (tom 700), bordas (tons 300 e 400), ocasião escolhida e etiquetas de ocasião (tom 300) |
| Brick Red | `brick-red` | `#C1121F` | Botão principal, números dos passos, arara, cabide e mensagens de erro (tom 800) |
| Molten Lava | `molten-lava` | `#780000` | Faixa de privacidade da página inicial |

Contrastes calculados: texto principal 16,7:1 no fundo; texto secundário acima de 7:1; texto do botão principal 5,5:1; bordas de campos acima de 3:1.

**Tipografia:** somente fontes sem serifa. Urbanist nos títulos e Instrument Sans no texto. As duas fontes são instaladas pelo npm e servidas junto com o site, sem depender do Google Fonts.

**Elemento marcante:** cada peça aparece como uma etiqueta de roupa clara, com furo e contorno vermelho. Quando uma peça é adicionada, a etiqueta entra com um leve balanço; o movimento é desligado para quem configurou o sistema para reduzir animações.

**Arara da página inicial:** as três etiquetas de exemplo ficam penduradas por um fio na arara. Quando o mouse passa por uma delas (ou o dedo toca, no celular), ela balança a partir do ponto em que o fio prende na arara, para o lado em que o mouse estava indo, e o balanço perde força até parar, como um cabide empurrado de leve. As etiquetas vizinhas balançam junto, mais fraco e um pouco depois. Também é desligado para quem pede menos animação no sistema.

## Estrutura do site

O site tem três páginas, com um menu fixo no topo.

**1. Início:** explica o produto para quem chega pela primeira vez.

- Abertura: o que o site faz, em uma frase, com botão para começar pelo guarda-roupa e um exemplo visual de etiquetas de peças.
- Como funciona: os quatro passos do produto, em ordem (cadastrar peças, descobrir o contraste, entender o formato do corpo, receber looks e a cápsula).
- Por que usar: economia, sustentabilidade e estilo, sem números que não tenham fonte.
- O que já funciona: separa o que está disponível agora do que está marcado como "Em breve".
- Privacidade: as fotos ficam no aparelho da pessoa.

**2. Meu guarda-roupa:** cadastro, lista e remoção de peças.

**3. Meu contraste:** a pessoa toca na pele, no cabelo e no olho da própria foto e descobre se o contraste é baixo, médio ou alto. Detalhes em [`docs/contraste.md`](contraste.md).

Funcionalidades que ainda não existem aparecem como "Em breve" e nunca como se já funcionassem.

## Privacidade

Foto de rosto e de corpo é informação pessoal delicada. Medidas propostas: consentimento claro, processar no aparelho, apagar a foto depois da análise e guardar só o resultado, não usar as fotos para treinar modelos e permitir apagar tudo. Antes de lançar para o público, vale uma revisão com um profissional de direito (LGPD).

## Sustentabilidade

A sustentabilidade precisa ser medida, não só declarada. Ordem de prioridade proposta: usar o que tem, consertar ou customizar, trocar ou comprar em brechó, e só por último comprar peça nova. Métricas propostas: looks por peça, peças paradas, custo por uso e compras evitadas. Números de economia de água, carbono ou resíduos só entram com fonte citada.

## Perguntas em aberto

- Nome definitivo do produto.
- Público: só feminino, masculino ou todas as pessoas.
- Plataforma: site, app ou site que funciona como app no celular.
- Brasil e português apenas, ou outros países e idiomas.
- Produto real, projeto de portfólio ou os dois.
- Classificação de contraste em três níveis está boa?
- Guia de formato do corpo: medidas, questionário ou foto.
- Origem das sugestões de peças a comprar.
- Limite de peças sugeridas por vez na lista de compras.
