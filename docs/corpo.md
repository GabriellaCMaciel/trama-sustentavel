# Etapa 3: Meu corpo

Documento da funcionalidade "Entenda o formato do seu corpo", escrito antes do código. Tudo que está marcado como "a validar" é proposta, não regra comprovada.

## Objetivo

Mostrar à pessoa qual formato de corpo mais se parece com o dela, quais modelagens de roupa costumam valorizar esse formato e quais peças do guarda-roupa dela já seguem essas modelagens.

O formato é uma orientação, não uma regra nem um julgamento. Nenhum texto fala em "defeito", "disfarçar" ou "corpo ideal". Uma pessoa pode ter traços de mais de um formato.

## Decisões

| Decisão | Escolha |
| --- | --- |
| Página | "Meu perfil", com duas abas: Contraste e Corpo. O menu continua com três links |
| Público | Todas as pessoas. Os formatos são descritos só por proporção, sem separar por gênero |
| Como a pessoa informa o corpo | Medidas com fita métrica (caminho principal) ou escolha da silhueta que mais parece com ela |
| Ligação com o guarda-roupa | Campo novo "Modelagem" nas peças. O resultado mostra as peças cuja modelagem costuma valorizar o formato |
| O que é salvo | As medidas (se informadas), o formato e como ele foi definido. Nenhuma foto do corpo |

## Medidas

Três circunferências em centímetros, com fita métrica, por cima de roupa fina ou sem roupa:

- **Tórax (busto ou peito):** na parte mais larga do tórax, com a fita reta nas costas.
- **Cintura:** na parte mais fina do tronco, normalmente um pouco acima do umbigo, sem encolher a barriga.
- **Quadril:** na parte mais larga do quadril e do bumbum, com os pés juntos.

Valores aceitos: de 40 a 250 cm em cada medida.

## Formatos e regras

As regras são uma adaptação simplificada da FFIT (Female Figure Identification Technique), criada por Simmons, Istook e Devarajan e usada em pesquisa de vestuário. Os limites originais, em polegadas, foram convertidos para centímetros (1 polegada = 2,54 cm). A FFIT original tem mais tipos (como ampulheta inferior e superior e "colher"); aqui eles foram agrupados em cinco formatos. A regra do formato oval segue a modificação para corpos plus size de Sokolowski e Bettencourt, que verifica se a cintura é maior que o tórax e o quadril.

A ordem de verificação é esta:

| Ordem | Formato | Regra (T = tórax, C = cintura, Q = quadril) |
| --- | --- | --- |
| 1 | Oval | C maior ou igual a T e C maior ou igual a Q |
| 2 | Triângulo | Q − T de 9,1 cm ou mais |
| 3 | Triângulo invertido | T − Q de 9,1 cm ou mais |
| 4 | Ampulheta | T − C de 22,9 cm ou mais, ou Q − C de 25,4 cm ou mais |
| 5 | Retângulo | Nenhuma das anteriores |

A FFIT foi criada a partir de corpos femininos. Usar as mesmas regras para todas as pessoas é uma decisão deste projeto, **a validar**. Nos testes com medidas típicas, corpos masculinos caem principalmente em retângulo e triângulo invertido, o que é coerente.

Fontes: [Sokolowski e Bettencourt, "Modification of the Female Figure Identification Technique (FFIT) Formulas to Include Plus Size Bodies", 3DBODY.TECH 2020](https://core.ac.uk/download/359918442.pdf) (reproduz as fórmulas originais da FFIT na Tabela 7).

## Escolha da silhueta

Para quem não tem fita métrica: cinco desenhos simples de silhueta (um por formato), com uma frase de descrição. A pessoa escolhe o que mais parece com ela. Mesmo depois de medir, ela pode trocar o formato à mão.

## Resultado

- Nome do formato e descrição por proporção.
- Dicas de modelagem e de detalhes (decote, comprimento).
- Modelagens que costumam valorizar, separadas em peças de cima, de baixo e peças únicas.
- Peças do guarda-roupa com essas modelagens.

Dicas baseadas em [The Wardrobe Consultant: Body Shape Guide](https://www.thewardrobeconsultant.com/body-shape-guide):

| Formato | Descrição | Dicas | Cima | Baixo | Peça única |
| --- | --- | --- | --- | --- | --- |
| Triângulo | Quadril mais largo que o tórax | Trazer interesse para a parte de cima: decote canoa, detalhes nos ombros. Embaixo, peças que acompanham o quadril | Ajustada, cintura marcada | Evasê, ampla | Evasê, cintura marcada |
| Triângulo invertido | Tórax mais largo que o quadril | Trazer interesse para a parte de baixo: calças e saias evasê ou amplas, detalhes na barra. Em cima, peças simples ou transpassadas | Ajustada, cintura marcada | Ampla, evasê | Evasê, cintura marcada |
| Retângulo | Tórax, cintura e quadril com medidas próximas | Criar cintura e volume: cintos, camisa por dentro, franzidos e pregas | Cintura marcada | Evasê, ampla | Cintura marcada |
| Ampulheta | Tórax e quadril parecidos, cintura bem mais fina | Acompanhar o equilíbrio que já existe: peças transpassadas, cintura marcada, calças que acompanham a curva | Ajustada, cintura marcada | Ajustada, ampla | Cintura marcada |
| Oval | Cintura maior ou igual ao tórax e ao quadril | Alongar a silhueta: decote em V, linhas verticais, casacos e camisas mais longos, cintura império | Reta | Reta | Reta |

## Modelagem das peças

Campo novo, opcional, no cadastro de peças (só para roupas; calçados e acessórios não têm):

| Valor | Quer dizer |
| --- | --- |
| Ajustada | Acompanha o corpo |
| Reta | Cai reto, sem marcar nem abrir |
| Ampla | Folgada, com volume |
| Evasê | Mais justa em cima e abrindo embaixo |
| Cintura marcada | Marca a cintura (transpassada, com cinto ou recorte) |

Peças cadastradas antes desse campo aparecem no resultado com um seletor para definir a modelagem ali mesmo, sem precisar cadastrar de novo.

No resultado, as peças são separadas em "Valorizam seu formato" (modelagem recomendada) e "Outras peças". Nenhuma peça é marcada como "evite".

## Privacidade

- Nenhuma foto do corpo é pedida.
- As medidas ficam só no navegador da pessoa (IndexedDB) e podem ser apagadas a qualquer momento.

## Fora desta etapa

- Altura e comprimento de pernas e tronco.
- Foto do corpo para análise automática.
- Formatos híbridos com duas classificações ao mesmo tempo.
