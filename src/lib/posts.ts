import { type CollectionEntry, getCollection } from "astro:content";

/** All blog posts, newest first — the canonical way to read the collection. */
export async function getSortedPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog");
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}
