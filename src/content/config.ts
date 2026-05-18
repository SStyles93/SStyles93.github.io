import { z, defineCollection, type CollectionEntry } from "astro:content";

const projectCollection = defineCollection({
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
		tags: z.array(z.string()).optional()
	})
});

const blogCollection = defineCollection({
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
		isProject: z.boolean().default(false),
		tags: z.array(z.string()).optional()
	})
});

export const collections = {
	'blogs' : blogCollection,
	'projects' : projectCollection
}

export type ProjectSchema = CollectionEntry<"projects">;
export type BlogSchema = CollectionEntry<"blogs">;