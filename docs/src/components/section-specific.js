import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const SectionSpecific = () => {
  const data = useStaticQuery(graphql`
    query SectionSpecificQuery {
      specific: file(absolutePath: { regex: "/specific.md/" }) {
        childrenMarkdownRemark {
          html
        }
      }
    }
  `)
  return (
    <section className="section" id="specific">
      <div className="inner">
        <h2 className="heading">{"Specific"}</h2>
        <div className="card">
          <div
            className={"markdown"}
            dangerouslySetInnerHTML={{
              __html: data.specific.childrenMarkdownRemark[0].html,
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default SectionSpecific
