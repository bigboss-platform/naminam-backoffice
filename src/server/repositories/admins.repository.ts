import 'server-only';
import * as demo from '../demo/admins.demo';
import { IS_DEMO_MODE } from '../demo/demoMode';
import * as mongo from './mongo/admins.mongo';

/** MongoDB, or in-memory data in DEMO MODE (server/demo/demoMode.ts). Same API either way. */
const impl: typeof mongo = IS_DEMO_MODE ? demo : mongo;

export const normalizeEmail = impl.normalizeEmail;
export const findAdminByEmail = impl.findAdminByEmail;
export const findAdminById = impl.findAdminById;
export const updateAdminPassword = impl.updateAdminPassword;
export type { AdminRecord } from './mongo/admins.mongo';
