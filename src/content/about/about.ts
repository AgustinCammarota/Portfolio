import { defineCollection, z } from 'astro:content';

export const aboutCollection = defineCollection({
  type: 'content',
  schema: z.object({
    author: z.string(),
    company: z.string(),
    rol: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
  })
});
