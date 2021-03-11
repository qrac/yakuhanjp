import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const SectionHowToUse = () => {
  const data = useStaticQuery(graphql`
    query SectionHowToUseQuery {
      cdn: file(absolutePath: { regex: "/cdn.md/" }) {
        childrenMarkdownRemark {
          html
        }
      }
      npm: file(absolutePath: { regex: "/npm.md/" }) {
        childrenMarkdownRemark {
          html
        }
      }
    }
  `)
  return (
    <section className="section" id="how-to-use">
      <div className="inner">
        <h2 className="heading">{"How To Use"}</h2>
        <div className="card">
          <div
            className={"markdown"}
            dangerouslySetInnerHTML={{
              __html: data.cdn.childrenMarkdownRemark[0].html,
            }}
          />
        </div>
        <div className="card">
          <div
            className={"markdown"}
            dangerouslySetInnerHTML={{
              __html: data.npm.childrenMarkdownRemark[0].html,
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default SectionHowToUse
