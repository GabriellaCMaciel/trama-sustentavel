interface SilhouetteProps {
  /** Meias-larguras: ombros/tórax, cintura e quadril (unidades do desenho). */
  widths: [number, number, number]
  className?: string
  /** Mostra as linhas de onde medir, numeradas 1 (tórax), 2 (cintura) e 3 (quadril). */
  guides?: boolean
  title?: string
}

const CENTER = 60
/** Alturas no desenho: pescoço, ombro, tórax, cintura, quadril e fim. */
const Y = { neck: 26, shoulder: 38, chest: 60, waist: 102, hips: 140, end: 194 }

/** Curva suave entre dois pontos, com tangente vertical (o contorno fica arredondado). */
function curve(x1: number, y1: number, x2: number, y2: number) {
  const middle = (y1 + y2) / 2
  return `C ${x1} ${middle} ${x2} ${middle} ${x2} ${y2}`
}

function outline([chest, waist, hips]: [number, number, number]) {
  const right = [
    [CENTER + 7, Y.neck],
    [CENTER + chest + 3, Y.shoulder],
    [CENTER + chest, Y.chest],
    [CENTER + waist, Y.waist],
    [CENTER + hips, Y.hips],
    [CENTER + hips * 0.78, Y.end],
  ]
  const left = right.map(([x, y]) => [2 * CENTER - x, y]).reverse()

  let path = `M ${right[0][0]} ${right[0][1]} L ${right[1][0]} ${right[1][1]}`
  for (let i = 1; i < right.length - 1; i++) path += ` ${curve(right[i][0], right[i][1], right[i + 1][0], right[i + 1][1])}`
  path += ` L ${left[0][0]} ${left[0][1]}`
  for (let i = 0; i < left.length - 2; i++) path += ` ${curve(left[i][0], left[i][1], left[i + 1][0], left[i + 1][1])}`
  path += ` L ${left[left.length - 1][0]} ${left[left.length - 1][1]} Z`
  return path
}

export function Silhouette({ widths, className, guides = false, title }: SilhouetteProps) {
  const lines: [number, number][] = [
    [Y.chest, widths[0]],
    [Y.waist, widths[1]],
    [Y.hips, widths[2]],
  ]
  return (
    <svg
      viewBox="0 0 120 200"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx={CENTER} cy={13} r={11} className="fill-steel-blue-300" />
      <path d={outline(widths)} className="fill-steel-blue-300 stroke-steel-blue-600" strokeWidth={1.5} />
      {guides &&
        lines.map(([y, half], index) => (
          <g key={y}>
            <line
              x1={CENTER - half - 6}
              x2={CENTER + half + 6}
              y1={y}
              y2={y}
              className="stroke-brick-red-700"
              strokeWidth={2}
              strokeDasharray="4 3"
            />
            <circle cx={CENTER + half + 15} cy={y} r={8} className="fill-brick-red" />
            <text
              x={CENTER + half + 15}
              y={y + 3.5}
              textAnchor="middle"
              className="fill-papaya-whip text-[10px] font-bold"
            >
              {index + 1}
            </text>
          </g>
        ))}
    </svg>
  )
}
