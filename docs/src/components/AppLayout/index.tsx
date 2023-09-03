import AppMain from "../AppMain"
import AppFooter from "../AppFooter"

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <AppMain>{children}</AppMain>
      <AppFooter />
    </div>
  )
}
