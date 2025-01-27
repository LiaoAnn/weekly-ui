import { HeadingItem } from '../types';

export function findAndExpandParents (
  items: HeadingItem[],
  targetId: string,
  parents: string[] = []
): string[] {
  for (const item of items) {
    if (item.id === targetId) return parents;
    if (item.children?.length) {
      const found = findAndExpandParents(item.children, targetId, [
        ...parents,
        item.id,
      ]);
      if (found.length) return found;
    }
  }
  return [];
}
