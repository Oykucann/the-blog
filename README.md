# the-blog

A blog for posts written by more than one person. Built with [Astro](https://astro.build) and published to GitHub Pages at **https://oykucann.github.io/the-blog/**.

- Every post credits everyone who worked on it, with their role. Nobody gets ranked or measured.
- Text belongs to everyone by default. A section shows a name only if its author signs it with `<Signed>`.
- Readers can pick light or dark mode and one of six accent colours from the **Appearance** menu.

## Run it locally

Requires Node 22.12 or newer.

```sh
npm install
npm run dev      # http://localhost:4321/the-blog/
npm run build    # type-checks, then builds to dist/
```

## Write a post

1. Create a branch.
2. Add a folder under `src/content/posts/`. The folder name becomes the URL: `posts/<folder-name>/`.
3. Put the text in `index.mdx` in that folder, and put images next to it.
4. Open a pull request. The **Check** workflow builds the site and fails if something is wrong, for example an unknown author or an image without alt text.
5. Merge to `main`. The **Deploy** workflow publishes the site.

Front matter:

```yaml
---
title: Three weeks we lost moving to a monorepo
description: One or two sentences shown under the title and in link previews.
date: 2026-09-18
authors:
  - { author: oyku, roles: [writing] }
  - { author: deniz, roles: [writing, editing] }
  - { author: kerem, roles: [code] }
tags: [infrastructure, ci]
draft: false # true = visible in `npm run dev` only
---
```

Roles are `writing`, `editing`, `code`, `illustration`, `research` and `review`. You can also set `updated`, and a `cover` image with `coverAlt`.

The post [How we write here](src/content/posts/how-we-write/index.mdx) is the full reference for every building block, with its syntax.

| Block | What it is for |
| --- | --- |
| `<Figure src alt caption credit width>` | Images with numbered captions. `alt` is required. |
| `<Table caption source>` | Wraps a Markdown table and gives it a numbered caption. |
| `<Terminal title>` | Commands and their output. |
| `<CodeBlock title href>` | A named function or file. |
| `<Details summary open>` | A collapsible drill-down box. |
| `<Quote by source href variant>` | A quote with attribution, or `variant="pull"` for a pull quote. |
| `<Note type title>` | A `note`, `tip` or `warning` box. |
| `<Signed by>` | A section its author chose to sign. |
| `[^1]` footnotes | Collected into the **References** list at the end. |

These components are available in every post without importing them. Images still need an import at the top of the post: `import chart from './chart.png'`.

## Add an author

Create `src/content/authors/<id>.yaml`. The file name is the id you use in posts.

```yaml
name: Deniz Aydın
title: Platform Engineer
github: denizaydin # optional, used for the avatar and profile link
color: "#1971c2"   # used for the byline mark and signed sections
bio: One or two sentences.
```

`deniz` and `kerem` are example authors, and `three-weeks-in-a-monorepo` is an example post. Replace them with real ones.

## Publishing setup (one time)

In the repository settings, go to **Settings → Pages** and set **Source** to **GitHub Actions**. After that, every push to `main` deploys.

To use a custom domain, set `site` in `astro.config.mjs` to the domain, remove `base`, and add the domain in **Settings → Pages**.

## Project layout

```
src/
  content/
    authors/        one YAML file per person
    posts/<slug>/   index.mdx and its images
  components/
    prose/          building blocks used inside posts
  layouts/          page and post layouts
  pages/            routes: home, posts, authors, RSS, 404
  styles/           design tokens (global.css) and article styles (prose.css)
  content.config.ts schema for posts and authors
```
