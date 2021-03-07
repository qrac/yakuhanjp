import React from "react"

import AppLayout from "../components/app-layout"
import SectionHero from "../components/section-hero"
import SectionSimulator from "../components/section-simulator"
import SectionGlyphs from "../components/section-glyphs"
import SectionSupport from "../components/section-support"
import SectionLicense from "../components/section-license"

export default function Home() {
  return (
    <AppLayout>
      <SectionHero />
      <SectionSimulator />
      <SectionGlyphs />
      <SectionSupport />
      <SectionLicense />
    </AppLayout>
  )
}
