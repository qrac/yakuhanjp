import type pjt from "../../../../../project.json"
import type { FontOptions } from "../../../utils/simulator"

export type Options = FontOptions & {
  weight: number
  size: string
  vertical: boolean
}

export type Props = {
  settings: typeof pjt.home.simulator
  codeExamples: Record<string, string>
}
