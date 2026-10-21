import { useEffect, useState } from "react"

// Read before the first render so restored settings never flash or overwrite the URL.
export function useQueryState<
  T extends Record<string, string | number | boolean>,
>(read: (params: URLSearchParams) => T) {
  const [state, setState] = useState(() =>
    read(new URLSearchParams(location.search)),
  )

  useEffect(() => {
    const url = new URL(location.href)
    for (const [key, value] of Object.entries(state)) {
      url.searchParams.set(key, String(value))
    }
    // Editing text should not create a browser history entry for every keystroke.
    history.replaceState(history.state, "", url)
  }, [state])

  useEffect(() => {
    const restore = () => setState(read(new URLSearchParams(location.search)))
    window.addEventListener("popstate", restore)
    return () => window.removeEventListener("popstate", restore)
  }, [read])

  return [state, setState] as const
}
