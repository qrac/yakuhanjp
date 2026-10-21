export type FontOptions = {
  style: string
  target: string
  font: string
}

export function getFontName(options: FontOptions, callFileName: boolean) {
  switch (true) {
    case options.style === "sans-serif" && options.target === "small":
      return callFileName ? "yakuhanjp_s" : "YakuHanJPs"
    case options.style === "serif" && options.target === "all":
      return callFileName ? "yakuhanmp" : "YakuHanMP"
    case options.style === "serif" && options.target === "small":
      return callFileName ? "yakuhanmp_s" : "YakuHanMPs"
    case options.style === "rounded-sans-serif" && options.target === "all":
      return callFileName ? "yakuhanrp" : "YakuHanRP"
    case options.style === "rounded-sans-serif" && options.target === "small":
      return callFileName ? "yakuhanrp_s" : "YakuHanRPs"
    default:
      return callFileName ? "yakuhanjp" : "YakuHanJP"
  }
}
export function getFallbackFont(options: FontOptions) {
  switch (true) {
    case options.style === "sans-serif" && options.font === "noto":
      return `"Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif`
    case options.style === "serif" && options.font === "hiragino":
      return `"Hiragino Mincho ProN", "Noto Serif JP", "Yu Mincho", YuMincho, serif`
    case options.style === "serif" && options.font === "noto":
      return `"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", YuMincho, serif`
    case options.style === "rounded-sans-serif" && options.font === "mplusr1c":
      return `"M PLUS Rounded 1c", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
    default:
      return `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif`
  }
}

export function getExampleKey({ style, target, font }: FontOptions) {
  return `${style}:${target}:${font}`
}
