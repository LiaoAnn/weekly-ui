import { HeadingItem } from '../types';

export function useHeadingTree (headings: HeadingItem[]) {
  const buildHeadingTree = (items: HeadingItem[]): HeadingItem[] => {
    const root: HeadingItem[] = [];
    const stack: HeadingItem[] = [];

    items.forEach((heading) => {
      const node = { ...heading, children: [] };

      while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(node);
      } else {
        stack[stack.length - 1].children?.push(node);
      }

      stack.push(node);
    });

    return root;
  };

  return buildHeadingTree(headings);
}
