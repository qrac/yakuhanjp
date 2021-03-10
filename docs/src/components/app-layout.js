import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import ieBuster from "ie-buster"

import AppFooter from "./app-footer"

//import "@fontsource/noto-sans-jp/100.css"
//import "@fontsource/noto-sans-jp/300.css"
//import "@fontsource/noto-sans-jp/400.css"
//import "@fontsource/noto-sans-jp/500.css"
//import "@fontsource/noto-sans-jp/700.css"
//import "@fontsource/noto-sans-jp/900.css"
//import "@fontsource/noto-serif-jp/200.css"
//import "@fontsource/noto-serif-jp/300.css"
//import "@fontsource/noto-serif-jp/400.css"
//import "@fontsource/noto-serif-jp/500.css"
//import "@fontsource/noto-serif-jp/600.css"
//import "@fontsource/noto-serif-jp/700.css"
//import "@fontsource/noto-serif-jp/900.css"
//import "@fontsource/m-plus-rounded-1c/100.css"
//import "@fontsource/m-plus-rounded-1c/300.css"
//import "@fontsource/m-plus-rounded-1c/400.css"
//import "@fontsource/m-plus-rounded-1c/500.css"
//import "@fontsource/m-plus-rounded-1c/700.css"
//import "@fontsource/m-plus-rounded-1c/800.css"
//import "@fontsource/m-plus-rounded-1c/900.css"

//import "yakuhanjp/dist/css/yakuhanjp.css"
//import "yakuhanjp/dist/css/yakuhanjp_s.css"
//import "yakuhanjp/dist/css/yakuhanmp.css"
//import "yakuhanjp/dist/css/yakuhanmp_s.css"
//import "yakuhanjp/dist/css/yakuhanrp.css"
//import "yakuhanjp/dist/css/yakuhanrp_s.css"
//import "yakuhanjp/dist/css/yakuhanjp-noto.css"
//import "yakuhanjp/dist/css/yakuhanjp_s-noto.css"
//import "yakuhanjp/dist/css/yakuhanmp-noto.css"
//import "yakuhanjp/dist/css/yakuhanmp_s-noto.css"
//import "yakuhanjp/dist/css/yakuhanjp-narrow.css"
//import "yakuhanjp/dist/css/yakuhanjp_s-narrow.css"

import "../assets/css/theme-light.css"
import "../assets/css/theme-dark.css"
import "../assets/css/theme-variable.css"
import "../assets/css/styles.css"

import yakuhanjpPkg from "yakuhanjp/package.json"
import pjt from "../../project.json"

const site = pjt.site

const yakuhanjpList = [
  "yakuhanjp",
  "yakuhanjp_s",
  "yakuhanmp",
  "yakuhanmp_s",
  "yakuhanrp",
  "yakuhanrp_s",
  "yakuhanjp-noto",
  "yakuhanjp_s-noto",
  "yakuhanmp-noto",
  "yakuhanmp_s-noto",
  "yakuhanjp-narrow",
  "yakuhanjp_s-narrow",
]

const AppLayout = ({ children }) => {
  useEffect(() => {
    ieBuster.init()
  }, [])
  return (
    <div className="app" id="app">
      <Helmet htmlAttributes={{ lang: "ja" }}>
        <title>{site.title + " - " + site.subTitle}</title>
        <meta name="description" content={site.description} />
        <meta
          property="og:title"
          content={site.title + " - " + site.subTitle}
        />
        <meta property="og:description" content={site.description} />
        <meta property="og:url" content={site.url} />
        <meta property="og:image" content={site.url + "/ogp.png"} />
        <meta
          property="og:site_name"
          content={site.title + " - " + site.subTitle}
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={"@" + site.twitter.id} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {yakuhanjpList.map((item) => (
          <link
            rel="preload"
            href={`https://cdn.jsdelivr.net/npm/yakuhanjp@${yakuhanjpPkg.version}/dist/css/${item}.min.css`}
            as="style"
            onload="this.onload=null;this.rel='stylesheet'"
          />
        ))}
        <link
          rel="preload"
          href={
            "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&family=Noto+Sans+JP:wght@100;300;400;500;700;900&family=Noto+Serif+JP:wght@200;300;400;500;600;700;900&display=swap"
          }
          as="style"
          onload="this.onload=null;this.rel='stylesheet'"
        />
      </Helmet>
      <main className="main" id="main">
        {children}
      </main>
      <AppFooter />
    </div>
  )
}

export default AppLayout
