import { MDXRemote } from "next-mdx-remote/rsc";
import remarkCustomHeadingId from "../../../lib/remarkCustomHeadingId";
import TableOfContents from "../../mdx/TableOfContents";
import { extractHeadings } from "../../mdx/utils";

// 修正檔案路徑邏輯
function getMarkdownPath(slug: string[]) {
  // 修正：確保路徑指向正確的目錄結構
  const path = slug.join("/");
  return `https://raw.githubusercontent.com/ruanyf/weekly/refs/heads/master/docs/${path}`;
}

async function fetchMarkdown(markdownURL: string) {
  try {
    const res = await fetch(markdownURL, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
      },
      next: {
        revalidate: 3600, // 選擇性：快取一小時
      },
    });

    if (!res.ok) {
      console.error("Fetch error:", markdownURL, res.status, res.statusText);
      throw new Error(`Failed to fetch markdown: ${res.statusText}`);
    }

    return res.text();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

// 先驗證頁面路徑的格式是否正確
export async function generateStaticParams() {
  return [
    { slug: ["docs", "issue-284"] },
    { slug: ["docs", "issue-285"] },
    // 可以加入更多的有效路徑
  ];
}

const DocsPage = async ({ params }: { params: { slug: string[] } }) => {
  const markdownURL = getMarkdownPath(params.slug);
  const markdown = await fetchMarkdown(markdownURL);
  const headings = extractHeadings(markdown);

  return (
    <div className="container mx-auto flex">
      <TableOfContents headings={headings} />
      <div className="w-full md:w-3/4 p-4">
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

export default DocsPage;
