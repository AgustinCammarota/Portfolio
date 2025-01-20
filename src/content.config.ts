import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const about = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/about" }),
  schema: z.object({
    author: z.string(),
    company: z.string(),
    rol: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/projects" }),
  schema: z.object({
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    video: z.string(),
    technologies: z.string(),
    title: z.string(),
    hasLink: z.boolean().default(false),
    github: z.string().default(""),
    hasWebsite: z.boolean().default(false),
    website: z.string().default(""),
  }),
});

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/works" }),
  schema: z.object({
    order: z.number(),
    time: z.string(),
    title: z.string(),
    companyName: z.string(),
    companyLink: z.string(),
    companyIcon: z.string(),
  }),
});

export const collections = { about, projects, works };
