import { readFileSync } from "node:fs";
import satori from "satori";
import sharp from "sharp";

// Geist static TTFs (satori cannot read the woff2 the site ships). Read from
// the project root — `astro build` runs static endpoints with cwd = root.
const FONT_DIR = "./src/assets/fonts";
const fonts = [
  {
    name: "Geist",
    weight: 300 as const,
    style: "normal" as const,
    data: readFileSync(`${FONT_DIR}/Geist-Light.ttf`),
  },
  {
    name: "Geist",
    weight: 400 as const,
    style: "normal" as const,
    data: readFileSync(`${FONT_DIR}/Geist-Regular.ttf`),
  },
  {
    name: "Geist",
    weight: 500 as const,
    style: "normal" as const,
    data: readFileSync(`${FONT_DIR}/Geist-Medium.ttf`),
  },
];

// Theme tones (dark), converted from the OKLCH tokens in global.css.
const COLOR = {
  paper: "#0c0c09",
  text: "#f4f4f0",
  muted: "#7c7c67",
  border: "#2b2b22",
};

// The site logo glyph, monochrome, embedded as an <img> data URI.
const LOGO_PATH =
  "M121.623 100.766V0H0V21.2214H100.377V211.125H121.623V122.108C166.128 127.378 200.753 165.258 200.753 211.125C200.753 222.898 198.432 234.555 193.921 245.431C189.411 256.308 182.8 266.19 174.465 274.515C166.131 282.839 156.236 289.442 145.347 293.948C134.458 298.453 122.787 300.771 111 300.771C99.2134 300.771 87.5423 298.453 76.6529 293.948C65.7635 289.442 55.8692 282.839 47.5349 274.515C39.2005 266.19 32.5893 256.308 28.0788 245.431C23.5683 234.555 21.2467 222.898 21.2467 211.125H0C0 272.264 49.7952 322 111 322C172.205 322 222 272.264 222 211.125C222 153.572 177.863 106.107 121.623 100.766Z";
const logoSrc = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 222 322"><path fill="${COLOR.text}" d="${LOGO_PATH}"/></svg>`
).toString("base64")}`;

type Style = Record<string, unknown>;
type VNode = {
  type: string;
  props: { style?: Style; children?: unknown; [key: string]: unknown };
};

// Minimal hyperscript so we can build satori's element tree without JSX.
const el = (
  type: string,
  props: { style?: Style; [key: string]: unknown },
  children?: unknown
): VNode => ({ type, props: { ...props, children } });

export interface OgData {
  title: string;
  eyebrow?: string;
}

export async function renderOgImage({
  title,
  eyebrow,
}: OgData): Promise<Buffer> {
  const titleSize = title.length > 70 ? 52 : title.length > 44 ? 62 : 72;

  const tree = el(
    "div",
    {
      style: {
        height: "630px",
        width: "1200px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        padding: "80px",
        backgroundColor: COLOR.paper,
        color: COLOR.text,
        fontFamily: "Geist",
      },
    },
    [
      el(
        "div",
        {
          style: {
            display: "flex",
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "0.01em",
            color: COLOR.muted,
          },
        },
        eyebrow ?? "John Schmidt"
      ),
      el(
        "div",
        {
          style: {
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
            overflow: "hidden",
            maxWidth: "1040px",
            fontSize: titleSize,
            lineHeight: 1.12,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: COLOR.text,
          },
        },
        title
      ),
      el(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          },
        },
        [
          el(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "14px" } },
            [
              el("img", { src: logoSrc, width: 26, height: 38 }),
              el(
                "div",
                { style: { display: "flex", fontSize: 24, fontWeight: 500 } },
                "John Schmidt"
              ),
            ]
          ),
          el(
            "div",
            { style: { display: "flex", fontSize: 20, color: COLOR.muted } },
            "johnschmidt.de"
          ),
        ]
      ),
    ]
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return await sharp(Buffer.from(svg)).png().toBuffer();
}
