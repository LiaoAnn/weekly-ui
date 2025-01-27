import { HeadingItem, CollapsibleState, HeadingVisibility } from "../types";
import { HeadingTree } from "./HeadingTree";

interface HeadingTreeItemProps extends CollapsibleState, HeadingVisibility {
  item: HeadingItem;
}

export function HeadingTreeItem({
  item,
  collapsedState,
  setCollapsedState,
  visibleHeadings,
  activeId,
}: HeadingTreeItemProps) {
  const hasChildren = item.children?.length;
  const isCollapsed = collapsedState[item.id] ?? true;
  const isActive = item.id === activeId;

  const handleClick = () => {
    if (!hasChildren) return;

    setCollapsedState((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }));
  };

  return (
    <li className="relative">
      <div
        onClick={handleClick}
        className={`
          cursor-pointer py-1 px-2 rounded-md
          ${hasChildren ? "hover:bg-gray-100" : ""}
          ${isActive ? "bg-blue-50" : ""}
        `}
      >
        <a
          href={`#${item.id}`}
          className={`
            block transition-colors duration-300
            ${isActive ? "text-blue-600 font-bold" : "text-gray-600"}
            ${hasChildren ? "hover:text-blue-500" : ""}
          `}
          style={{ marginLeft: `${(item.level - 1) * 1}rem` }}
        >
          {item.text}
        </a>
      </div>
      {hasChildren && (
        <div
          className={`
            overflow-hidden transition-[max-height] duration-300 ease-in-out
            ${isCollapsed ? "max-h-0" : "max-h-[500px]"}
          `}
          style={{ willChange: "max-height" }}
        >
          {!isCollapsed && (
            <HeadingTree
              items={item.children!}
              collapsedState={collapsedState}
              setCollapsedState={setCollapsedState}
              visibleHeadings={visibleHeadings}
              activeId={activeId}
            />
          )}
        </div>
      )}
    </li>
  );
}
