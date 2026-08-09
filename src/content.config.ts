import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const safeHttpsUrl = z.url().refine((value) => value.startsWith('https://'), {
  message: 'Only HTTPS URLs are allowed for published project links.'
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(2),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    summary: z.string().min(30),
    problem: z.string().min(30),
    role: z.string().min(3),
    team: z.string().min(3),
    contributions: z.array(z.string().min(10)).min(1),
    skills: z.array(z.string().min(1)).min(1),
    repository: safeHttpsUrl,
    demo: safeHttpsUrl.optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    year: z.number().int().min(2020).max(2100),
    evidence: z.array(z.object({
      label: z.string().min(2),
      value: z.string().min(2)
    })).default([]),
    metrics: z.array(z.object({
      value: z.string().min(1),
      label: z.string().min(2),
      qualifier: z.string().optional()
    })).default([]),
    gallery: z.array(z.object({
      src: z.string().min(1),
      alt: z.string().min(8)
    })).default([]),
    architecture: z.array(z.string().min(2)).min(2),
    security: z.array(z.string().min(8)).default([]),
    outcomes: z.array(z.string().min(8)).min(1),
    lessons: z.array(z.string().min(8)).min(1)
  })
});

export const collections = { projects };
