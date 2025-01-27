export interface HeadingItem {
  level: number;
  text: string;
  id: string;
  children?: HeadingItem[];
}

export interface CollapsibleState {
  collapsedState: Record<string, boolean>;
  setCollapsedState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export interface HeadingVisibility {
  visibleHeadings: Set<string>;
  activeId: string;
}
