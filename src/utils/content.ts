import { getCollection, type CollectionEntry } from "astro:content";
import dayjs from "dayjs";
import type { CategoryId, SeriesId } from "../data/taxonomy";

type Entry = CollectionEntry<"projects"> | CollectionEntry<"blogs">;

// Manual `order` first, then newest first
export function byOrderThenDate(a: Entry, b: Entry) {
  if (a.data.order === b.data.order) {
    return dayjs(b.data.creationDate).valueOf() - dayjs(a.data.creationDate).valueOf();
  }
  return a.data.order - b.data.order;
}

export async function getProjects() {
  return (await getCollection("projects")).sort(byOrderThenDate);
}

/** Real articles: blog posts that are not short teasers for a project page. */
export async function getArticles() {
  return (await getCollection("blogs", (post) => !post.data.isProject)).sort(byOrderThenDate);
}

export async function getSeriesParts(id: SeriesId) {
  const posts = await getCollection("blogs", (post) => post.data.series?.id === id);
  return posts.sort((a, b) => a.data.series!.part - b.data.series!.part);
}

/** Teasers live on their project page, so link there directly. */
export function postUrl(post: CollectionEntry<"blogs">) {
  return post.data.isProject && post.data.project
    ? `/projects/${post.data.project}/`
    : `/blogs/${post.id.toLowerCase()}/`;
}

export const projectUrl = (project: CollectionEntry<"projects">) => `/projects/${project.id.toLowerCase()}/`;

export async function countByCategory(category: CategoryId) {
  const [projects, articles] = await Promise.all([getProjects(), getArticles()]);
  return {
    projects: projects.filter((p) => p.data.category === category).length,
    articles: articles.filter((a) => a.data.category === category).length,
  };
}
