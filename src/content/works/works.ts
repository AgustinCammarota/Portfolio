import { defineCollection, z } from 'astro:content';

export const worksCollection = defineCollection({
  type: 'content',
  schema: z.object({
    time: z.string(),
    title: z.string(),
  })
});
