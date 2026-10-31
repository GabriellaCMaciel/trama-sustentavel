# Etapa 2: Meu contraste

Documento da funcionalidade "Descubra seu contraste", escrito antes do código. Tudo que está marcado como "a validar" é proposta, não regra comprovada.

## Objetivo

Mostrar à pessoa se o contraste natural entre a pele, o cabelo e os olhos dela é baixo, médio ou alto. Com isso, o site explica que tipo de combinação de roupa tende a valorizar e quais peças do guarda-roupa dela combinam com esse nível.

## O que é contraste pessoal

É a diferença entre o quanto a pele, o cabelo e os olhos são claros ou escuros, como se a foto estivesse em preto e branco. Não depende da cor em si, só da claridade. Exemplos das fontes:

- **Alto:** diferença grande entre um ou mais traços, como cabelo muito escuro com olhos azul-claros, ou cabelo branco com olhos castanho-escuros.
- **Médio:** existe diferença, mas não extrema.
- **Baixo:** traços com claridade parecida, como pele clara, cabelo loiro-claro e olhos claros.

Fontes: [A Well Styled Life: How to find your personal contrast level](https://awellstyledlife.com/how-to-find-your-personal-contrast-level/) e [Inside Out Style: How to figure out your contrast](https://insideoutstyleblog.com/2011/09/how-to-figure-out-your-contrast.html).

## Decisões

| Decisão | Escolha |
| --- | --- |
| Página | Aba "Contraste" da página "Meu perfil" (antes era a página "Meu contraste") |
| Como achar pele, cabelo e olhos | A pessoa toca em cada ponto na própria foto (sem IA) |
| Resultado | Nível + explicação + exemplos de combinações + peças do guarda-roupa que combinam |
| Onde fica a foto | Só na memória do navegador enquanto a página está aberta; nunca é salva |
| O que é salvo | As três cores tocadas, a claridade de cada uma e o nível (no navegador, IndexedDB) |

## Fluxo

1. **Orientações para a foto:** luz natural de frente (perto de uma janela), sem filtro, sem óculos escuros, cabelo aparecendo, maquiagem leve. Se o cabelo é tingido, vale a cor atual.
2. **Escolher a foto:** câmera ou galeria.
3. **Tocar nos três pontos, em ordem:** pele (bochecha, longe de sombra e brilho), cabelo (uma parte com a cor mais comum, sem reflexo de luz) e olho (a parte colorida, a íris). O site mostra a amostra de cor de cada toque e permite tocar de novo para corrigir.
4. **Ver o resultado:** o nível, uma escala com a claridade dos três pontos, a explicação, os exemplos de combinações e as peças do guarda-roupa.
5. **Ajuste manual:** se a pessoa não concordar, pode escolher outro nível. O site guarda que o nível foi ajustado à mão.
6. **Refazer ou apagar:** botões para fazer de novo e para apagar o resultado salvo.

## Como o cálculo funciona

1. Em cada toque, o site lê a cor média de uma pequena área ao redor do ponto (não só um pixel), para diminuir o efeito de ruído da foto.
2. Converte cada cor para **L\*** (claridade do espaço de cor CIELAB), de 0 (preto) a 100 (branco). É a medida padrão de claro e escuro como o olho percebe.
3. O contraste é a **maior diferença de L\*** entre os três pontos.
4. O nível sai desta tabela (limites propostos, **a validar** com fotos reais):

| Maior diferença de L\* | Nível |
| --- | --- |
| Menor que 30 | Baixo |
| De 30 a 49 | Médio |
| 50 ou mais | Alto |

Os limites foram testados com tons típicos convertidos para L\*. Exemplos: pele muito clara, cabelo preto e olho azul-claro dá 80 (alto); pele clara, cabelo castanho médio e olho mel dá 42 (médio); pele retinta, cabelo preto e olho castanho-escuro dá 21 (baixo); pele muito clara, cabelo loiro e olho azul dá 25 (baixo). Luz e câmera mudam esses números, por isso existe o ajuste manual.

## Textos do resultado

- **Baixo:** seus traços têm claridade parecida. Combinações suaves, tom sobre tom ou com cores de claridade próxima costumam valorizar mais do que contrastes fortes, que podem "apagar" o rosto.
- **Médio:** existe diferença entre seus traços, mas não extrema. Combinações com uma cor média ao lado de uma clara ou de uma escura costumam funcionar bem.
- **Alto:** seus traços têm diferença grande de claridade. Combinações com claro e escuro bem marcados, como preto e branco, costumam acompanhar a força do seu rosto.

## Exemplos de combinações

Cada nível mostra três pares de cores em amostras, escolhidos para que a diferença de claridade entre as duas cores esteja dentro da faixa do nível (verificado no código).

## Ligação com o guarda-roupa

- Cada peça cadastrada ganha uma claridade a partir da cor principal: clara (L\* 65 ou mais), média (35 a 64) ou escura (menos de 35).
- O site monta pares de "parte de cima" com "parte de baixo" do guarda-roupa e mostra os pares cuja diferença de claridade está dentro da faixa do nível da pessoa.
- Se faltarem peças (por exemplo, nenhuma parte de baixo), o site diz o que falta cadastrar.

## Privacidade

- A foto do rosto não sai do aparelho e não é salva: some quando a página é fechada ou quando a pessoa refaz.
- Só ficam salvas as três cores e o nível.
- A pessoa pode apagar o resultado a qualquer momento.

## Fora desta etapa

- Subtom (quente, frio, neutro) e estação da coloração pessoal.
- Detecção automática do rosto.
