export type MediaType = 'image' | 'video';

/** A dessert on the menu. `slug` is the stable public id (landing deep links: /menu#slug). */
export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Category slug (e.g. "cheesecake"). */
  categoryId: string;
  /** Soles (PEN), e.g. 25 */
  price: number;
  description: string;
  /** Short tasting note under the name ("Chocolate intenso"). */
  note: string;
  /** Optional ribbon on the photo ("Favorito de la casa"). Empty = none. */
  badge: string;
  /** Shown in "Los consentidos de la casa" (home wheel). */
  isFeatured: boolean;
  /** Complement sold with other desserts ("Extra de helado"). */
  isAddOn: boolean;
  /** Hidden from the public menu when false (sold out / seasonal). */
  isAvailable: boolean;
  mediaType: MediaType;
  /** Public link to the photo or video. Empty = branded placeholder. */
  mediaUrl: string;
  /** Video cover image (optional). */
  posterUrl: string;
  sortOrder: number;
  updatedAt: string;
};

/** What the product form edits (everything except ids and timestamps). */
export type ProductInput = Omit<Product, 'id' | 'slug' | 'sortOrder' | 'updatedAt'>;

export const EMPTY_PRODUCT_INPUT: ProductInput = {
  name: '',
  categoryId: '',
  price: 0,
  description: '',
  note: '',
  badge: '',
  isFeatured: false,
  isAddOn: false,
  isAvailable: true,
  mediaType: 'image',
  mediaUrl: '',
  posterUrl: '',
};
