import type { LayoutProps } from "minista/types"

import CommonFooter from "../components/common/footer"
import pjt from "../../project.json"
import "./globals.css"
import "./style.css"

export default function ({
  title,
  url,
  noindex,
  children,
}: LayoutProps & { noindex?: boolean }) {
  const { site, home } = pjt
  const pageTitle = title
    ? `${title} - ${site.name}`
    : `${site.name} - ${home.hero.title}`

  return (
    <html lang={site.language}>
      <head>
        <title>{pageTitle}</title>
        <meta name="description" content={site.description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={site.description} />
        <meta property="og:url" content={site.url + url} />
        <meta property="og:image" content={site.url + site.assets.ogp} />
        <meta property="og:site_name" content={site.name} />
        <meta
          property="og:type"
          content={url === "/" ? "website" : "article"}
        />
        <meta name="twitter:card" content={site.social.x.card} />
        <meta name="twitter:creator" content={"@" + site.social.x.id} />
        {noindex && <meta name="robots" content="noindex" />}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="apple-touch-icon" href={site.assets.appleTouchIcon} />
        <link rel="icon" href={site.assets.favicon} />
      </head>
      <body className="layout">
        <main className="layout-main">{children}</main>
        <CommonFooter
          copyrightSince={site.copyright.since}
          copyrightHolder={site.copyright.holder}
          copyrightUrl={site.copyright.url}
        />
      </body>
    </html>
  )
}
