# Etapa 4: Looks e cápsula

Documento da funcionalidade "Receba looks e sua cápsula", escrito antes do código. Tudo que está marcado como "a validar" é proposta, não regra comprovada.

## Objetivo

Montar looks com as peças que a pessoa já tem, mostrar a cápsula que já existe dentro do guarda-roupa dela, apontar as peças paradas e sugerir as poucas compras que mais aumentariam os looks, sempre lembrando de procurar em brechó ou troca antes de comprar nova.

## Decisões

| Decisão | Escolha |
| --- | --- |
| Página | Nova página "Looks" no menu, com duas abas: Looks (`#/looks`) e Cápsula (`#/looks/capsula`) |
| Look completo | Parte de cima + parte de baixo, ou peça única, + calçado. Casaco e acessório são complementos opcionais |
| Escopo | Gerador de looks, cápsula, peças paradas e lista de compras, juntos |
| Compras | Só descrição da peça (sem links de loja), com quantos looks novos ela cria e lembrete de brechó, troca e conserto antes de comprar nova |
| Limite de compras sugeridas | 3 por vez (responde à pergunta em aberto do documento de produto) |
| O que é salvo | Nada novo: looks e cápsula são calculados na hora, a partir das peças e do perfil |

## Como um look é montado

1. **Base:** cada combinação de parte de cima com parte de baixo, e cada peça única sozinha. Casacos não entram na base.
2. **Calçado:** cada base é combinada com cada calçado.
3. **Ocasião:** o look vale para uma ocasião quando todas as peças obrigatórias (base e calçado) têm essa ocasião. Peça sem nenhuma ocasião marcada vale para todas.
4. **Complementos:** para cada look, o site indica o casaco e o acessório que mais combinam, se houver, pela mesma regra de cores.

## Cores neutras e fortes

O site usa o **croma** (C\*) do espaço de cor CIELAB, que mede a intensidade da cor. Uma cor com croma menor que 26 conta como **neutra**. Com esse limite, preto, branco, off-white, cinza, bege, cáqui, marrom, marinho e jeans contam como neutros, e vermelho, amarelo, verde e azul-royal como cores fortes (verificado no código).

## Look bom

Um look é **bom** quando passa nas duas regras abaixo. Só looks bons aparecem na aba Looks e entram nas contas da cápsula.

1. **Cores harmônicas:** no máximo duas peças de cor forte entre as peças obrigatórias. É uma simplificação, **a validar**: não verifica se as duas cores fortes combinam entre si.
2. **Contraste (se a pessoa já fez a etapa 2):** a diferença de claridade entre a parte de cima e a de baixo (ou entre a peça única e o calçado) fica dentro da faixa do nível dela, com as mesmas faixas da etapa 2.

## Ordem dos looks

Cada look bom ganha pontos, e cada ponto aparece como um motivo na tela:

| Motivo | Pontos |
| --- | --- |
| Combina com o seu contraste (etapa 2 feita) | 2 |
| Cada roupa com modelagem que valoriza o seu formato (etapa 3 feita) | 1 por roupa |
| Só cores neutras ou uma cor forte de destaque | 1 |

Para não repetir sempre as mesmas peças, a lista é montada aos poucos: cada vez que uma peça já apareceu, os próximos looks com ela perdem meio ponto. Aparecem 12 looks, com um botão para ver mais.

Quando a etapa 2 ou a 3 não foi feita, o site avisa que os looks ficam mais personalizados depois de completar o perfil, com link para a aba certa.

## Cápsula

- **Looks por peça:** quantos looks bons usam cada peça (casacos e acessórios contam como complementos e aparecem à parte).
- **Sua cápsula:** as peças com mais looks bons, com um limite por categoria: 4 partes de cima, 3 de baixo, 2 peças únicas, 2 calçados e 1 casaco (até 12 peças). O site mostra quantos looks bons a cápsula forma sozinha. Os limites são uma proposta, **a validar**.
- **Peças paradas:** roupas e calçados que não entram em nenhum look bom. Para cada uma, o site sugere, nesta ordem: combinar com outra peça, consertar ou customizar, trocar ou doar.

## Lista de compras

1. O site testa peças imaginárias simples: parte de cima, parte de baixo e calçado, em três tons neutros (off-white, cinza médio e preto) e, para roupas, na modelagem que mais valoriza o formato da pessoa (ou reta, se a etapa 3 não foi feita).
2. Para cada uma, conta quantos looks bons **novos** ela criaria com o guarda-roupa atual.
3. Mostra as 3 que mais criam looks, com o número de looks novos. Peças que não criam nenhum look não aparecem.
4. Antes da lista, o lembrete: procure primeiro em brechó, em trocas com amigos ou veja se uma peça parada resolve com um conserto.

## Fora desta etapa

- Salvar looks favoritos e marcar looks usados (base para custo por uso).
- Looks por clima e agenda.
- Verificar se duas cores fortes combinam entre si.
