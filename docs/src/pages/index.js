import React from "react"

import AppLayout from "../components/app-layout"
import SectionHero from "../components/section-hero"
import SectionSimulator from "../components/section-simulator"
import SectionFonts from "../components/section-fonts"
import SectionSupport from "../components/section-support"
import SectionLicense from "../components/section-license"

export default function Home() {
  return (
    <AppLayout>
      <SectionHero />
      <SectionSimulator />
      <SectionFonts />
      <SectionSupport />
      <SectionLicense />
    </AppLayout>
  )
}
