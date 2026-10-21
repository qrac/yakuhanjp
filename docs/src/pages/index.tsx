import type { GetStaticData, PageProps } from "minista/types"

import CommonDocs from "../components/common/docs"
import ElementSection from "../components/element/section"
import ElementCard from "../components/element/card"
import PageHomeHero from "../components/page/home/hero"
import PageHomeSimulator from "../components/page/home/simulator"
import PageHomeFontsGrid from "../components/page/home/fonts-grid"
import { createSimulatorExamples } from "../components/utils/highlight"
import type { Props as SimulatorProps } from "../components/page/home/simulator/props"
import MdCdn from "../assets/markdown/cdn.mdx"
import MdNpm from "../assets/markdown/npm.mdx"
import MdOther from "../assets/markdown/other.mdx"
import MdLicense from "../assets/markdown/license.mdx"

import pkg from "yakuhanjp/package.json"
import pjt from "../../project.json"

export const getStaticData: GetStaticData = async () => ({
  props: {
    codeExamples: await createSimulatorExamples(
      pkg.version,
      pjt.home.simulator,
    ),
  },
})

export default function ({
  codeExamples,
}: PageProps & Pick<SimulatorProps, "codeExamples">) {
  const headings = pjt.home.sections
  return (
    <>
      <PageHomeHero
        id="hero"
        name={pjt.site.name}
        description={pjt.home.hero.description}
        version={pkg.version}
        license={pkg.license}
        repositoryUrl={pjt.site.social.github.url}
      />

      <ElementSection id="simulator" heading={headings.simulator}>
        <PageHomeSimulator
          settings={pjt.home.simulator}
          codeExamples={codeExamples}
          client:load
        />
      </ElementSection>

      <ElementSection id="fonts" heading={headings.fonts}>
        <PageHomeFontsGrid />
      </ElementSection>

      <ElementSection id="how-to-browser" heading={headings.howToBrowser}>
        <ElementCard>
          <CommonDocs>
            <MdCdn />
          </CommonDocs>
        </ElementCard>
        <ElementCard>
          <CommonDocs>
            <MdNpm />
          </CommonDocs>
        </ElementCard>
      </ElementSection>

      <ElementSection id="how-to-other" heading={headings.howToOther}>
        <ElementCard>
          <CommonDocs>
            <MdOther />
          </CommonDocs>
        </ElementCard>
      </ElementSection>

      <ElementSection id="license" heading={headings.license}>
        <ElementCard>
          <CommonDocs>
            <MdLicense />
          </CommonDocs>
        </ElementCard>
      </ElementSection>
    </>
  )
}
