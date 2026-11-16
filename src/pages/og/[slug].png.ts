// Link-preview images (Open Graph / Twitter), drawn at build time.
// One for the home page and one per case study: /og/home.png, /og/waymark.png, ...
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { profile, statusLabel } from "../../lib/profile";

const font = (pkg: string, file: string) => readFileSync(resolve("node_modules/@fontsource", pkg, "files", file));

const fonts = [
  { name: "Newsreader", data: font("newsreader", "newsreader-latin-400-normal.woff"), weight: 400 as const, style: "normal" as const },
  { name: "Instrument Sans", data: font("instrument-sans", "instrument-sans-latin-500-normal.woff"), weight: 500 as const, style: "normal" as const },
];

const paper = "#f4f3ee";
const ink = "#1a1c1a";
const ink2 = "#474b46";
const accent = "#1b5b45";
const rule = "#dcdad2";

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style: { display: "flex", ...style }, children },
});

export async function getStaticPaths() {
  const projects = (await getCollection("projects")).filter((p) => p.data.featured);
  return [
    { params: { slug: "home" }, props: { headline: profile.positioning, kicker: profile.displayName, foot: `${profile.title} at ENSIA` } },
    ...projects.map((p) => ({
      params: { slug: p.id },
      props: { headline: p.data.title, kicker: p.data.tagline, foot: `${statusLabel[p.data.status]}. Case study by ${profile.displayName}` },
    })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const { headline, kicker, foot } = props as { headline: string; kicker: string; foot: string };
  const long = headline.length > 30;

  const tree = el("div", { width: 1200, height: 630, background: paper, color: ink }, [
    el("div", { width: 1040, height: 486, margin: "72px 80px", flexDirection: "column", justifyContent: "space-between" }, [
      el("div", { fontFamily: "Instrument Sans", fontSize: 30, color: ink2 }, kicker),
      el(
        "div",
        { fontFamily: "Newsreader", fontSize: long ? 82 : 132, lineHeight: 1.04, letterSpacing: "-0.03em", maxWidth: 980 },
        headline,
      ),
      el("div", { width: "100%", alignItems: "center", borderTop: `2px solid ${rule}`, paddingTop: 28 }, [
        el("div", { width: 14, height: 14, borderRadius: 7, background: accent, marginRight: 16 }),
        el("div", { fontFamily: "Instrument Sans", fontSize: 26, color: ink2 }, foot),
      ]),
    ]),
  ]);

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
