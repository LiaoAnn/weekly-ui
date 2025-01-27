"use client";
import { useState } from "react";
import { HeadingItem } from "./types";
import { useHeadingTree } from "./hooks/useHeadingTree";
import { useHeadingVisibility } from "./hooks/useHeadingVisibility";
import { HeadingTree } from "./components/HeadingTree"; // 修正引入路徑
import { cn } from "@/lib/utils";

export default function TableOfContents({
  headings,
}: {
  headings: HeadingItem[];
}) {
  const treeData = useHeadingTree(headings);
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>(
    {}
  );
  const { visibleHeadings, activeId } = useHeadingVisibility(
    headings,
    treeData,
    setCollapsedState
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "sticky top-0 min-h-screen max-h-screen py-4 md:py-8",
        "transition-all duration-300",
        isCollapsed
          ? "w-0"
          : "w-full md:w-1/4 px-4 md:px-8 border-r border-gray-200 dark:border-gray-700"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "p-1 rounded-full",
          isCollapsed ? "fixed left-0" : "absolute right-0 translate-x-1/2",
          "flex items-center justify-center",
          "bg-blue-50 dark:bg-blue-950 hover:bg-blue-50/50 dark:hover:bg-blue-900/50 text-blue-600 font-bold",
          "transition-all duration-300"
        )}
        aria-label={isCollapsed ? "Expand" : "Collapse"}
      >
        <span className="aspect-square h-4 w-4 text-center leading-none">
          {isCollapsed ? ">" : "<"}
        </span>
      </button>
      <div
        className={cn(
          isCollapsed ? "w-0" : "w-full",
          "overflow-x-hidden transition-all duration-300"
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="md:text-lg font-bold mb-2">Table of Contents</h2>
        </div>
        <HeadingTree
          items={treeData}
          collapsedState={collapsedState}
          setCollapsedState={setCollapsedState}
          visibleHeadings={visibleHeadings}
          activeId={activeId}
        />
      </div>
    </div>
  );
}
