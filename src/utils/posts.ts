import { getCollection, getEntries, type CollectionEntry } from 'astro:content';
import { ROLES, type Role } from '../content.config';

export type Post = CollectionEntry<'posts'>;
export type Author = CollectionEntry<'authors'>;

/** Published posts, newest first. Drafts are visible in `astro dev` only. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * Everyone who worked on a post, each listed once.
 * Sorted by name so the byline never implies who did more.
 */
export async function getPostAuthors(post: Post): Promise<Author[]> {
  const refs = post.data.authors.map((a) => a.author);
  const unique = refs.filter((r, i) => refs.findIndex((x) => x.id === r.id) === i);
  const entries = await getEntries(unique);
  return entries.sort((a, b) => a.data.name.localeCompare(b.data.name, 'en'));
}

export interface CreditLine {
  role: Role;
  label: string;
  people: Author[];
}

/** Credits grouped by role, in the fixed order defined by ROLES. */
export async function getCredits(post: Post): Promise<CreditLine[]> {
  const authors = await getPostAuthors(post);
  const byId = new Map(authors.map((a) => [a.id, a]));
  return (Object.keys(ROLES) as Role[])
    .map((role) => ({
      role,
      label: ROLES[role],
      people: post.data.authors
        .filter((a) => a.roles.includes(role))
        .map((a) => byId.get(a.author.id)!)
        .sort((a, b) => a.data.name.localeCompare(b.data.name, 'en')),
    }))
    .filter((line) => line.people.length > 0);
}

export function postUrlPath(post: Post): string {
  return `posts/${post.id}/`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toLocaleUpperCase('en');
}
