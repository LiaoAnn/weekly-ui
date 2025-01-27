import { MDXRemote } from "next-mdx-remote/rsc";
import remarkCustomHeadingId, {
  generateId,
} from "../../lib/remarkCustomHeadingId";
import TableOfContents from "./TableOfContents";

async function fetchMarkdown(markdownURL: string) {
  const res = await fetch(markdownURL);
  const markdown = await res.text();
  return markdown;
}

function extractHeadings(markdown: string) {
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

      // 更新 heading stack
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

const Page = async () => {
  const markdownURL =
    "https://raw.githubusercontent.com/ruanyf/weekly/refs/heads/master/README.md";
  const markdown = await fetchMarkdown(markdownURL);
  const headings = extractHeadings(markdown);

  return (
    <div className="md:container mx-auto flex">
      {/* Table of Contents */}
      <TableOfContents headings={headings} />
      {/* Markdown Content */}
      <div className="w-full md:w-3/4 p-4 md:p-8">
        <MDXRemote
          source={markdown}
          components={{
            h1: (props) => (
              <h1 className="text-3xl font-bold my-4" {...props} />
            ),
            h2: (props) => (
              <h2 className="text-2xl font-semibold my-3" {...props} />
            ),
            p: (props) => {
              // 檢查是否為粗體標題段落
              if (props.className === "bold-heading") {
                return <p {...props} className="text-lg font-semibold my-2" />;
              }
              return <p className="text-base my-2" {...props} />;
            },
            strong: (props) => <strong className="font-semibold" {...props} />,
            ul: (props) => <ul className="list-none ml-4 my-2" {...props} />,
            li: (props) => <li className="mb-1" {...props} />,
            a: (props) => (
              <a
                className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-600 transition-colors duration-150"
                {...props}
              />
            ),
          }}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkCustomHeadingId],
            },
          }}
        />
      </div>
    </div>
  );
};

export default Page;
