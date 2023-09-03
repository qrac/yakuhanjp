import satori from "satori"
import { Resvg } from "@resvg/resvg-js"

export async function generateOgp({
  text,
  font,
}: //vertical,
{
  text: string
  font: Buffer
  //vertical: boolean
}) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "left",
          width: 1200,
          height: 630,
          background: "linear-gradient(90deg, #e6e6e6 50%, #f2f2f2 50%)",
        },
        children: {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 1040,
              height: 390,
              fontSize: "60px",
              color: "#333333",
              //writingMode: vertical ? "vertical-rl" : "inherit",
            },
            children: text,
          },
        },
      },
    } as any,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "MergedYakuhanJP",
          data: font,
          weight: 900,
          style: "normal",
        },
      ],
    }
  )

  const resvg = new Resvg(svg)

  return resvg.render().asPng()
}
