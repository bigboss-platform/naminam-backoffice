'use client';

import { useEffect, useEffectEvent, useRef, type ReactNode } from 'react';
import type { SheetActionItem } from './SheetActions.component';
import styles from './DropdownMenu.module.css';

type DropdownMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  items: SheetActionItem[];
  label: string;
  header?: ReactNode;
};

/**
 * Desktop action menu anchored to its parent (the parent needs `position: relative`).
 * Outside click or Escape closes it; choosing an item closes it, then runs the action.
 * Mobile uses the bottom sheet with the same items instead.
 */
export function DropdownMenu({ isOpen, onClose, items, label, header }: DropdownMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!isOpen) return;
    const anchor = panelRef.current?.parentElement;
    const onPointerDown = (event: PointerEvent) => {
      if (anchor && !anchor.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={panelRef} className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`} role="menu" aria-label={label} aria-hidden={!isOpen}>
      {header}
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          tabIndex={isOpen ? 0 : -1}
          className={`${styles.item} ${item.isDanger ? styles.danger : ''}`}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
            item.onSelect();
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
