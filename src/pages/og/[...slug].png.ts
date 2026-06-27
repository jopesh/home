import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { SITE_TITLE } from "../../consts";
import { type OgData, renderOgImage } from "../../lib/og";

const formatDate = (date: Date) =>
  date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");

  return [
    {
      params: { slug: "home" },
      props: {
        title: "Bildung im Rettungswesen & Webentwicklung",
        eyebrow: "",
      } satisfies OgData,
    },
    ...posts.map((post) => ({
      params: { slug: post.id },
      props: {
        title: post.data.title,
        eyebrow: formatDate(post.data.pubDate),
      } satisfies OgData,
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as OgData);

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
