import { visit } from "unist-util-visit"
import { toString } from "mdast-util-to-string"

// 統一的 ID 生成邏輯
export function generateId (text: string, parentId?: string): string {
  const baseId = text
    .toLowerCase()
    .replace(/\*\*/g, '')
    .trim()
    // 只替換掉特殊符號，保留中文和英文數字
    .replace(/[^\w\s\u4e00-\u9fff]+/g, '')  // 保留中文範圍 \u4e00-\u9fff
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');

  return parentId ? `${parentId}-${baseId}` : baseId;
}

export default function remarkCustomHeadingId () {
  const headingStack: Array<{ text: string, id: string }> = [];

  return (tree) => {
    visit(tree, ['heading', 'paragraph'], (node) => {
      // 處理標題
      if (node.type === 'heading') {
        const text = toString(node);
        const id = generateId(text);

        // 更新 heading stack
        while (headingStack.length > 0 && headingStack[headingStack.length - 1].level >= node.depth) {
          headingStack.pop();
        }
        headingStack.push({ text, id, level: node.depth });

        if (!node.data) node.data = {};
        if (!node.data.hProperties) node.data.hProperties = {};
        node.data.hProperties.id = id;
      }

      // 處理段落中的粗體文字
      if (node.type === 'paragraph' &&
        node.children?.length === 1 &&
        node.children[0].type === 'strong') {
        const text = toString(node);
        const parentHeading = headingStack[headingStack.length - 1];
        const id = parentHeading ? generateId(text, parentHeading.id) : generateId(text);

        if (!node.data) node.data = {};
        if (!node.data.hProperties) node.data.hProperties = {};
        node.data.hProperties.id = id;
        node.data.hProperties.className = 'bold-heading';
      }
    });
  };
}