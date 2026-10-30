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

## Identidade visual

Tema escuro que combina duas paletas de referência. Os contrastes de texto foram calculados e ficam acima de 4,5:1.

| Cor | Código | Paleta | Uso no site |
| --- | --- | --- | --- |
| Blush Ivory | `#F6E7E0` | 1 | Texto principal |
| Rose Clay | `#C87B7E` | 1 | Base do tom de "Remover" e das mensagens de erro |
| Dusty Mauve | `#7A4D8C` | 1 | Bordas |
| Plum Wine | `#4B1F3A` | 1 | Painéis e cartões |
| Twilight Blue | `#2F3E5B` | 1 | Etiquetas de ocasião |
| Champagne | `#F2E4D0` | 2 | Texto das etiquetas |
| Antique Gold | `#C6A15B` | 2 | Título, botão principal e caixas de seleção |
| Burgundy | `#6E1734` | 2 | Ainda sem uso; reservada para destaques |
| Wine | `#8F2948` | 2 | Ainda sem uso; reservada para destaques |
| Espresso | `#2A1018` | 2 | Fundo da página e campos |

**Tipografia:** Bodoni Moda nos títulos (referência de revista de moda) e Instrument Sans no texto. As duas fontes são instaladas pelo npm e servidas junto com o site, sem depender do Google Fonts.

**Elemento marcante:** cada peça aparece como uma etiqueta de roupa clara, com furo e contorno dourado. Quando uma peça é adicionada, a etiqueta entra com um leve balanço; o movimento é desligado para quem configurou o sistema para reduzir animações.

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
