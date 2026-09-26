import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const ROLES = {
  writing: 'Written by',
  editing: 'Edited by',
  code: 'Code',
  illustration: 'Illustrations',
  research: 'Research',
  review: 'Review',
} as const;

export type Role = keyof typeof ROLES;

const roleEnum = z.enum(Object.keys(ROLES) as [Role, ...Role[]]);

const authors = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.url().optional(),
    // Used only for small markers: the byline dot and <Signed> sections.
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex color like "#1971c2"'),
    bio: z.string().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      authors: z
        .array(
          z.object({
            author: reference('authors'),
            roles: z.array(roleEnum).default(['writing']),
          }),
        )
        .min(1),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }).refine((d) => !d.cover || d.coverAlt, {
      message: 'A cover image needs coverAlt text',
      path: ['coverAlt'],
    }),
});

export const collections = { authors, posts };
