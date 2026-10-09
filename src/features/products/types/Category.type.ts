/** Menu section ("Postre", "Sbriciolata", "Cheesecake"). `slug` is what products reference. */
export type Category = {
  id: string;
  slug: string;
  label: string;
  /** Short line under the section title on the menu. */
  tagline: string;
  sortOrder: number;
};

export type CategoryInput = Pick<Category, 'label' | 'tagline'>;

export const EMPTY_CATEGORY_INPUT: CategoryInput = { label: '', tagline: '' };
