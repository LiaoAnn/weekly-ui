import { HeadingItem } from "../types";

interface HeadingTreeProps {
  items: HeadingItem[];
  collapsedState: Record<string, boolean>;
  setCollapsedState: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  visibleHeadings: Set<string>;
  activeId: string;
}

export function HeadingTree({
  items,
  collapsedState,
  setCollapsedState,
  visibleHeadings,
  activeId,
}: HeadingTreeProps) {
  return (
    <ul className="space-y-1.5 md:space-y-1">
      {items.map((item) => (
        <li key={item.id} className="relative group">
          <div
            onClick={() =>
              item.children?.length &&
              setCollapsedState((prev) => ({
                ...prev,
                [item.id]: !prev[item.id],
              }))
            }
            className={`
              cursor-pointer py-1.5 px-2 rounded-md
              transition-all duration-200 ease-in-out
              hover:bg-blue-50/50
              dark:hover:bg-blue-900/50
              ${item.id === activeId ? "bg-blue-50" : ""}
            `}
          >
            <a
              href={`#${item.id}`}
              className={`
                block transition-all duration-200
                group-hover:translate-x-1
                text-sm md:text-base
                text-nowrap
                ${
                  item.id === activeId
                    ? "text-blue-600 font-bold"
                    : "text-gray-600 dark:text-gray-200 hover:text-blue-500"
                }
              `}
              style={{ marginLeft: `${(item.level - 1) * 0.75}rem` }}
            >
              {item.text}
            </a>
          </div>
          {item.children?.length && !collapsedState[item.id] ? (
            <div
              className="
                overflow-hidden transition-all 
                duration-300 ease-in-out ml-4
              "
              style={{ willChange: "max-height" }}
            >
              <HeadingTree
                items={item.children}
                collapsedState={collapsedState}
                setCollapsedState={setCollapsedState}
                visibleHeadings={visibleHeadings}
                activeId={activeId}
              />
            </div>
          ) : (
            <></>
          )}
        </li>
      ))}
    </ul>
  );
}
