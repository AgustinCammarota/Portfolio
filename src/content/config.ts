import { defineCollection, z } from 'astro:content';

const aboutCollection = defineCollection({
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

const worksCollection = defineCollection({
  type: 'content',
  schema: z.object({
    time: z.string(),
    title: z.string(),
  })
});

const projectsCollection = defineCollection({
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
    link: z.string()
  })
});

export const collections = {
  'about': aboutCollection,
  'works': worksCollection,
  'projects': projectsCollection
};
