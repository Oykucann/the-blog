import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getEntries } from 'astro:content';
import { getPosts, postUrlPath } from '../utils/posts';
import { SITE, url } from '../utils/site';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const items = await Promise.all(
    posts.map(async (post) => {
      const authors = await getEntries(post.data.authors.map((a) => a.author));
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: url(postUrlPath(post)),
        author: authors.map((a) => a.data.name).join(', '),
        categories: post.data.tags,
      };
    }),
  );

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items,
  });
}
