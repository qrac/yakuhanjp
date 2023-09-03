import AppLayout from "../components/AppLayout"
import SectionHero from "../components/SectionHero"
import SectionBasic from "../components/SectionBasic"
import BlockSimulator from "../components/BlockSimulator?ph"
import BlockFontsGrid from "../components/BlockFontsGrid"
import BlockCard from "../components/BlockCard"
import BlockMarkdown from "../components/BlockMarkdown"
import MdCdn from "../assets/markdown/cdn.mdx"
import MdNpm from "../assets/markdown/npm.mdx"
import MdOther from "../assets/markdown/other.mdx"
import MdLicense from "../assets/markdown/license.mdx"

export default function () {
  return (
    <AppLayout>
      <SectionHero id="hero" />
      <SectionBasic id="simulator" heading={"Simulator"}>
        <BlockSimulator />
      </SectionBasic>
      <SectionBasic id="fonts" heading={"Fonts"}>
        <BlockFontsGrid />
      </SectionBasic>
      <SectionBasic id="how-to-browser" heading={"How To Browser"}>
        <BlockCard>
          <BlockMarkdown>
            <MdCdn />
          </BlockMarkdown>
        </BlockCard>
        <BlockCard>
          <BlockMarkdown>
            <MdNpm />
          </BlockMarkdown>
        </BlockCard>
      </SectionBasic>
      <SectionBasic id="how-to-other" heading={"How To Other"}>
        <BlockCard>
          <BlockMarkdown>
            <MdOther />
          </BlockMarkdown>
        </BlockCard>
      </SectionBasic>
      <SectionBasic id="license" heading={"License & Credit"}>
        <BlockCard>
          <BlockMarkdown>
            <MdLicense />
          </BlockMarkdown>
        </BlockCard>
      </SectionBasic>
    </AppLayout>
  )
}
