import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { getCollection } from "astro:content";

export async function GET(context) {
  const blogs = await getCollection("blogs");
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
