import 'server-only';
import * as demo from '../demo/products.demo';
import { IS_DEMO_MODE } from '../demo/demoMode';
import * as mongo from './mongo/products.mongo';

/** MongoDB, or in-memory data in DEMO MODE (server/demo/demoMode.ts). Same API either way. */
const impl: typeof mongo = IS_DEMO_MODE ? demo : mongo;

export const listProducts = impl.listProducts;
export const countProductsInCategory = impl.countProductsInCategory;
export const createProduct = impl.createProduct;
export const updateProduct = impl.updateProduct;
export const setProductFlag = impl.setProductFlag;
export const deleteProduct = impl.deleteProduct;
