import { useEffect } from "react"

import type { Options, Props } from "./props"

export function useGoogleFont(
  fonts: Props["settings"]["googleFonts"],
  { style, font, weight }: Options,
) {
  const selectedFont = fonts.find(
    (item) => item.style === style && item.font === font,
  )
  const href = selectedFont?.weights.includes(weight)
    ? `https://fonts.googleapis.com/css2?family=${selectedFont.family}:wght@${weight}&display=swap`
    : undefined

  useEffect(() => {
    if (!href) return

    const loaded = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
    ).some((link) => link.href === href)
    if (loaded) return

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    // Keep loaded fonts available when switching options or remounting.
    document.head.appendChild(link)
  }, [href])
}
