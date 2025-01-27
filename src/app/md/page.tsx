import React from "react";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkToc from "remark-toc";
import ReactMarkdown from "react-markdown";
import { toHast } from "mdast-util-to-hast";
import { toString } from "hast-util-to-string";

const getMarkdownContent = async (url: string) => {
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Cannot get Markdown content: ${res.status} ${res.statusText}`
    );
  }

  const fileContents = await res.text();
  const parsed = matter(fileContents);
  const content = parsed.content;
  const metadata = parsed.data;

  return { content, metadata };
};

const ExternalMarkdownPage = async () => {
  const markdownUrl =
    "https://raw.githubusercontent.com/ruanyf/weekly/refs/heads/master/README.md";

  // const { content: mdContent, metadata } = await getMarkdownContent(
  //   markdownUrl
  // );
  const mdContent = `
    # My Blog Post

    ## Introduction

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...

    ## Conclusion

    Sed ut perspiciatis unde omnis iste natus error sit voluptatem ...
  `;

  // Use unified and remark-parse to parse Markdown and extract headers
  const processor = unified().use(remarkParse);

  // Add the toc plugin to the processor to generate a table of contents
  processor.use(remarkToc, {
    heading: "Table of Contents",
    tight: true,
    maxDepth: 2,
  });

  // Parse the markdown and generate a table of contents
  const tree = processor.parse(mdContent);
  // const tocNode = tree.children.find((node) => node.type === "toc");
  // const tocItems = tocNode.items.map((item) => {
  //   const title = toString(toHast(item));
  //   const slug = item.slug;
  //   return { title, slug };
  // });

  return (
    <div className="flex p-8">
      <aside className="w-1/4 pr-8 sticky top-8 h-min">
        {/** TOC */}
        <ReactMarkdown>{mdContent}</ReactMarkdown>
      </aside>

      {/** Content */}
      <main className="w-3/4">
        {/* {metadata?.title && <h1>{metadata.title}</h1>} */}
        {/* <section
          dangerouslySetInnerHTML={{ __html: htmlContent.value }}
        ></section> */}
        {/* <ReactMarkdown
          rehypePlugins={[rehypeSanitize]}
          components={
            {
              // h1: ({ node, ...props }) => {
              //   const text = props.children?.toString() || "";
              //   const id = text;
              //   return (
              //     <h1 id={id} {...props} className="text-3xl font-bold mb-2" />
              //   );
              // },
              // h2: ({ node, ...props }) => {
              //   const text = props.children?.toString() || "";
              //   const id = text;
              //   return (
              //     <h2
              //       id={id}
              //       {...props}
              //       className="text-2xl font-semibold mb-2"
              //     />
              //   );
              // },
              // h3: ({ node, ...props }) => {
              //   const text = props.children?.toString() || "";
              //   const id = text;
              //   return (
              //     <h3 id={id} {...props} className="text-xl font-medium mb-2" />
              //   );
              // },
              // p: ({ node, ...props }) => {
              //   const text = props.children?.toString() || "";
              //   const id = typeof text === "string" ? text : undefined;
              //   return <p {...props} className="mb-2" />;
              // },
            }
          }
        >
          {tree.value.toString()}
        </ReactMarkdown> */}
      </main>
      <code>{JSON.stringify(tree, null, 2)}</code>
      {/* <code>{content}</code> */}
    </div>
  );
};

export default ExternalMarkdownPage;
