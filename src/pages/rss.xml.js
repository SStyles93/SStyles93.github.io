import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { getCollection } from "astro:content";

export async function GET(context) {
  // Teasers redirect to their project page, so only real articles go in the feed
  const blogs = await getCollection("blogs", (post) => !post.data.isProject);
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items: blogs.map((post) => ({
      title: post.data.title,
      pubDate: post.data.creationDate,
      description: post.data.description,
      link: `/blogs/${post.id.toLowerCase()}/`,
    })),
  });
}
