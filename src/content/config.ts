import { z, defineCollection, type CollectionEntry } from "astro:content";

const projectCollection = defineCollection({
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		creationDate: z.coerce.date(),
		order: z.number(),
		heroImage: image(),
		teamSize: z.number().optional(),
		timeFrame: z.string().optional(),
		toolUsed: z.string().optional(),
	})
});

export const collections = {
	'projects': projectCollection,
}

export type ProjectSchema = CollectionEntry<"projects">;