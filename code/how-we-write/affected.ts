/**
 * Which packages does a change affect?
 *
 * Example code for the "How we write here" guide. It is shown in the post
 * with <Snippet>, so edits here show up in the post on the next build.
 */

type Graph = Map<string, string[]>;

export function packageOf(path: string): string {
  const [, pkg] = path.split('/');
  return pkg;
}

/** Walk from each changed package to every package that depends on it. */
export function affected(changed: string[], graph: Graph): Set<string> {
  const result = new Set<string>();
  const queue = changed.map(packageOf);

  while (queue.length > 0) {
    const pkg = queue.shift()!;
    if (result.has(pkg)) continue;
    result.add(pkg);
    for (const [dependent, deps] of graph) {
      if (deps.includes(pkg)) queue.push(dependent);
    }
  }
  return result;
}

const graph: Graph = new Map([
  ['web', ['api', 'shared']],
  ['api', ['shared']],
  ['shared', []],
  ['infra', ['shared']],
]);

console.log(affected(['packages/shared/src/date.ts'], graph));
