/** Classes do Tailwind reutilizadas em mais de um componente. */

const buttonBase =
  'inline-flex h-12.5 cursor-pointer items-center justify-center whitespace-nowrap rounded-[10px] px-6 font-semibold no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-50'

/** Botão principal: vermelho com texto claro. */
export const buttonPrimary = `${buttonBase} bg-brick-red text-papaya-whip hover:bg-brick-red-400`

/** Botão claro, para usar sobre fundos vermelhos. */
export const buttonLight = `${buttonBase} bg-papaya-whip text-molten-lava hover:bg-papaya-whip-400`

export const buttonSecondary =
  'inline-flex h-12.5 cursor-pointer items-center justify-center rounded-[10px] border border-steel-blue-400 bg-transparent px-5.5 font-semibold text-papaya-whip transition-colors hover:border-papaya-whip'

export const fieldLabel = 'p-0 text-sm font-medium text-steel-blue-700'

export const input =
  'h-11.5 w-full rounded-[10px] border border-steel-blue-400 bg-deep-space-blue-200 px-3.5 text-papaya-whip transition-colors placeholder:text-steel-blue-600 hover:border-papaya-whip'

export const sectionTitle = 'text-[1.75rem] text-papaya-whip'
