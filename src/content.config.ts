import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: file("src/data/projects.yaml"),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string().nullable(),
    role: z.string(),
    team: z.number().int().positive(),
    period: z.string().nullable(),
    status: z.enum(["live", "in-progress", "complete", "private", "repo-coming"]),
    statusNote: z.string().nullable(),
    featured: z.boolean(),
    order: z.number(),
    result: z.string().nullable(),
    stack: z.array(z.string()),
    tags: z.array(z.string()),
    links: z.object({
      repo: z.string().url().nullable(),
      demo: z.string().nullable(),
    }),
  }),
});

// Case studies. The file name must match a featured project id.
const work = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/work" }),
  schema: z.object({
    // Shown under the cover figure. Say plainly when a figure is a schematic.
    coverCaption: z.string(),
  }),
});

export const collections = { projects, work };
