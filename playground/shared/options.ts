export const fonts = [
  "YakuHanJP",
  "YakuHanJPs",
  "YakuHanMP",
  "YakuHanMPs",
  "YakuHanRP",
  "YakuHanRPs",
] as const

export type FontName = (typeof fonts)[number]

export const weightNames = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
} as const

export type FontWeight = keyof typeof weightNames
export const weights = Object.keys(weightNames).map(Number) as FontWeight[]

export function getFontWeights(font: FontName): FontWeight[] {
  if (font.startsWith("YakuHanMP"))
    return weights.filter((weight) => weight !== 100 && weight !== 800)
  if (font.startsWith("YakuHanRP"))
    return weights.filter((weight) => weight !== 200 && weight !== 600)
  return weights
}

export function readChoice<T extends string | number>(
  value: string | null,
  choices: readonly T[],
  fallback: T,
): T {
  return choices.find((choice) => String(choice) === value) ?? fallback
}
