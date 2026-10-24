'use client';

import { DropdownMenu } from '@/features/core/components/DropdownMenu.component';
import { isDesktop } from '@/features/core/config/breakpoints.constants';
import type { Category } from '@/features/products/types/Category.type';
import type { CategoriesManagerCtx } from '../hooks/useCategoriesManager.hook';
import { getCategoryActions } from '../utils/categoryActions.util';
import styles from './CategoryRow.module.css';


/** Same rules as a product row: mobile → actions sheet, desktop → dropdown with the same actions. */
export function CategoryRow({ category, index, ctx }: { category: Category; index: number; ctx: CategoriesManagerCtx }) {
  const isMenuOpen = ctx.menuCategoryId === category.id;
  const count = ctx.productCountBySlug[category.slug] ?? 0;

  const onClick = () => {
    if (isDesktop()) ctx.toggleMenu(category);
    else ctx.openActions(category);
  };

  return (
    <div className={`${styles.wrap} ${isMenuOpen ? styles.wrapMenuOpen : ''} stagger-in`} style={{ '--i': index } as React.CSSProperties}>
      <button type="button" className={styles.row} onClick={onClick} aria-haspopup="menu" aria-expanded={isMenuOpen}>
        <span className={styles.icon} aria-hidden="true">
          <span className="material-symbols-outlined">category</span>
        </span>
        <span className={styles.text}>
          <span className={`${styles.label} font-display`}>{category.label}</span>
          <span className={styles.meta}>
            {count === 1 ? '1 producto' : `${count} productos`}
            {category.tagline ? ` · ${category.tagline}` : ''}
          </span>
        </span>
      </button>
      {isMenuOpen && <DropdownMenu isOpen onClose={ctx.closeMenu} label={category.label} items={getCategoryActions(ctx)} />}
    </div>
  );
}
