# code/

Source code that belongs to blog posts. Each post that has code gets its own folder, named after the post's folder in `src/content/posts/`.

```
code/
  <post-folder>/
    README.md    how to run it (optional)
    ...          any language, any structure
```

Show part of a file in a post with:

```mdx
<Snippet file="<post-folder>/file.ts" lines="12-30" />
```

The blog reads these files as plain text. It never runs, installs or type-checks them, so each folder can use its own language and tools.
