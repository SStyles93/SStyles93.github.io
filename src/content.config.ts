import { z, defineCollection, type CollectionEntry } from "astro:content";
import { glob } from "astro/loaders";
import { categoryIds, techIds, kindIds, seriesIds } from "./data/taxonomy";

const projectCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		creationDate: z.coerce.date(),
		order: z.number(),
		pinned: z.boolean().default(false),
		heroImage: image(),
		teamSize: z.number().optional(),
		timeFrame: z.string().optional(),
		toolUsed: z.string().optional(),
		category: z.enum(categoryIds),
		tags: z.array(z.enum(techIds)).optional()
	})
});

const blogCollection = defineCollection({
	loader: glob({ pattern: ["**/*.{md,mdx}", "!**/_*.{md,mdx}"], base: "./src/content/blogs" }),
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		creationDate: z.coerce.date(),
		order: z.number(),
		pinned: z.boolean().default(false),
		heroImage: image(),
		teamSize: z.number().optional(),
		timeFrame: z.string().optional(),
		toolUsed: z.string().optional(),
		// Short teaser for a project page: hidden from listings, its URL redirects to the project
		isProject: z.boolean().default(false),
		// Id of the related project (e.g. "mmgs_project"); required for teasers
		project: z.string().optional(),
		category: z.enum(categoryIds),
		kind: z.enum(kindIds).optional(),
		series: z.object({ id: z.enum(seriesIds), part: z.number() }).optional(),
		tags: z.array(z.enum(techIds)).optional()
	})
});

export const collections = {
	'blogs': blogCollection,
	'projects': projectCollection
}

export type ProjectSchema = CollectionEntry<"projects">;
export type BlogSchema = CollectionEntry<"blogs">;
