import { defineCollection, z } from 'astro:content';

export const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    video: z.string(),
    technologies: z.string(),
    title: z.string(),
    hasLink: z.boolean(),
    github: z.string(),
    hasWebsite: z.boolean(),
    website: z.string(),
  })
});
