import { generateId } from "../../lib/remarkCustomHeadingId";

export function extractHeadings (markdown: string) {
  const lines = markdown.split("\n");
  const headings = [];
  const headingStack: Array<{ level: number; text: string; id: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 匹配標題
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].replace(/\*\*/g, "").trim();
      const id = generateId(text);

      while (
        headingStack.length > 0 &&
        headingStack[headingStack.length - 1].level >= level
      ) {
        headingStack.pop();
      }
      headingStack.push({ level, text, id });
      headings.push({ level, text, id });
      continue;
    }

    // 匹配粗體文字
    const boldMatch = line.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch && headingStack.length > 0) {
      const text = boldMatch[1].trim();
      const parentHeading = headingStack[headingStack.length - 1];
      const id = generateId(text, parentHeading.id);

      headings.push({
        level: parentHeading.level + 1,
        text,
        id,
      });
    }
  }

  return headings;
}
