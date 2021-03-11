import React from "react"

import AppLayout from "../components/app-layout"
import SectionHero from "../components/section-hero"
import SectionSimulator from "../components/section-simulator"
import SectionFonts from "../components/section-fonts"
import SectionHowToUse from "../components/section-howtouse"
import SectionSpecific from "../components/section-specific"
import SectionSupport from "../components/section-support"
import SectionLicense from "../components/section-license"

const Home = () => {
  return (
    <AppLayout>
      <SectionHero />
      <SectionSimulator />
      <SectionFonts />
      <SectionHowToUse />
      <SectionSpecific />
      <SectionSupport />
      <SectionLicense />
    </AppLayout>
  )
}

export default Home
