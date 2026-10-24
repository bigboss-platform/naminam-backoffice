import 'server-only';
import * as demo from '../demo/categories.demo';
import { IS_DEMO_MODE } from '../demo/demoMode';
import * as mongo from './mongo/categories.mongo';

/** MongoDB, or in-memory data in DEMO MODE (server/demo/demoMode.ts). Same API either way. */
const impl: typeof mongo = IS_DEMO_MODE ? demo : mongo;

export const listCategories = impl.listCategories;
export const findCategoryById = impl.findCategoryById;
export const createCategory = impl.createCategory;
export const updateCategory = impl.updateCategory;
export const deleteCategory = impl.deleteCategory;
export const moveCategory = impl.moveCategory;
