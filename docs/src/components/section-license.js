import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default function SectionLicense() {
  const data = useStaticQuery(graphql`
    query SectionLicenseQuery {
      license: file(absolutePath: { regex: "/license.md/" }) {
        childrenMarkdownRemark {
          html
        }
      }
    }
  `)
  return (
    <section className="section" id="license">
      <div className="inner">
        <h2 className="heading">{"License & Credit"}</h2>
        <div className="card">
          <div
            className={"markdown"}
            dangerouslySetInnerHTML={{
              __html: data.license.childrenMarkdownRemark[0].html,
            }}
          />
        </div>
      </div>
    </section>
  )
}
