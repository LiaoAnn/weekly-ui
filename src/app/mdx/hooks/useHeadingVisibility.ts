import { useState, useRef, useEffect } from 'react';
import { HeadingItem, HeadingVisibility } from '../types';
import { findAndExpandParents } from '../utils/treeUtils';

export function useHeadingVisibility (
  headings: HeadingItem[],
  treeData: HeadingItem[],
  setCollapsedState: (value: React.SetStateAction<Record<string, boolean>>) => void
): HeadingVisibility {
  const [visibleHeadings, setVisibleHeadings] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string>('');
  const lastVisibleHeadings = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisible = new Set(lastVisibleHeadings.current);
        const newCollapsedState: Record<string, boolean> = {};
        const visiblePositions = new Map<string, number>();

        if (!entries.some(entry => entry.isIntersecting)) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            newVisible.add(entry.target.id);
            visiblePositions.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            newVisible.delete(entry.target.id);
            newCollapsedState[entry.target.id] = true;
          }
        });

        // 更新最接近頂部的標題
        if (visiblePositions.size > 0) {
          const closestId = Array.from(visiblePositions.entries())
            .sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))[0][0];
          setActiveId(closestId);
        }

        // 更新可見性狀態
        setVisibleHeadings(newVisible);

        // 更新折疊狀態
        newVisible.forEach(id => {
          const parents = findAndExpandParents(treeData, id);
          parents.forEach(parentId => {
            newCollapsedState[parentId] = false;
          });
          newCollapsedState[id] = false;
        });

        setCollapsedState(prev => ({ ...prev, ...newCollapsedState }));
      },
      {
        // 擴大觀察範圍，使追蹤更穩定
        rootMargin: "-10% 0px -70% 0px",
        threshold: [0, 1]
      }
    );

    // 觀察所有標題元素
    const allHeadingIds = new Set<string>();
    const collectIds = (items: HeadingItem[]) => {
      items.forEach(item => {
        allHeadingIds.add(item.id);
        if (item.children?.length) collectIds(item.children);
      });
    };
    collectIds(headings);

    allHeadingIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings, treeData, setCollapsedState]);

  return { visibleHeadings, activeId };
}
