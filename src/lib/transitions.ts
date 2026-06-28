/**
 * Shared view-transition names so a post's date and title morph smoothly
 * between the post list (index/archive) and the post page. The same name must
 * be present on both the outgoing and incoming page for the browser to pair the
 * snapshots, so both `post-list.astro` and `blog-post.astro` derive them here.
 */

/** Slug a post id down to a CSS-identifier-safe token. */
const slug = (id: string) => id.replace(/[^a-zA-Z0-9]/g, "-");

export const titleTransitionName = (id: string) => `title-pt-${slug(id)}`;
export const dateTransitionName = (id: string) => `date-pt-${slug(id)}`;
