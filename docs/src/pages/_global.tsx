import type { GlobalProps } from "minista"
import { Head } from "minista"
//import "highlight.js/styles/nord.css"
//import pkg from "yakuhanjp/package.json"

import site from "../assets/data/site.json"

/*const yakuhanjpList = [
  "yakuhanjp",
  "yakuhanjp_s",
  "yakuhanmp",
  "yakuhanmp_s",
  "yakuhanrp",
  "yakuhanrp_s",
]*/

export default function ({
  title,
  url,
  noindex,
  children,
}: GlobalProps & { noindex?: boolean }) {
  const siteTitle = site.title
  const siteSubTitle = site.subTitle
  const siteDescription = site.description
  const siteUrl = site.url
  const pageTitle = title
    ? title + " - " + siteTitle
    : siteTitle + " - " + siteSubTitle
  const ogUrl = siteUrl + url
  const ogImage = siteUrl + "/assets/images/ogp.png"
  const ogType = url === "/" ? "website" : "article"
  const twitterCard = "summary_large_image"
  const twitterId = "@" + site.twitter.id
  const appleTouchIcon = "/apple-touch-icon.png"
  const favicon = "/favicon.png"
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content={siteTitle} />
        <meta property="og:type" content={ogType} />
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:creator" content={twitterId} />
        {noindex && <meta name="robots" content="noindex" />}
        <link rel="stylesheet" href="/src/assets/entries/style.css" />
        {/*yakuhanjpList.map((item, index) => (
          <link
            rel="preload"
            href={`https://cdn.jsdelivr.net/npm/yakuhanjp@${pkg.version}/dist/css/${item}.css`}
            as="style"
            //@ts-ignore
            onLoad="this.onload=null;this.rel='stylesheet'"
            key={index}
          />
        ))*/}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/*<link
          rel="preload"
          href={
            "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;200;300;400;500;600;700;800;900&family=Noto+Serif+JP:wght@200;300;400;500;600;700;900&family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap"
          }
          as="style"
          //@ts-ignore
          onLoad="this.onload=null;this.rel='stylesheet'"
        />*/}
        <link rel="apple-touch-icon" href={appleTouchIcon} />
        <link rel="icon" href={favicon} />
      </Head>
      {children}
    </>
  )
}
