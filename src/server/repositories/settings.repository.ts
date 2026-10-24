import 'server-only';
import * as demo from '../demo/settings.demo';
import { IS_DEMO_MODE } from '../demo/demoMode';
import * as mongo from './mongo/settings.mongo';

/** MongoDB, or in-memory data in DEMO MODE (server/demo/demoMode.ts). Same API either way. */
const impl: typeof mongo = IS_DEMO_MODE ? demo : mongo;

export const getBusinessSettings = impl.getBusinessSettings;
export const updateBusinessSettings = impl.updateBusinessSettings;
export const addHoursRow = impl.addHoursRow;
export const updateHoursRow = impl.updateHoursRow;
export const deleteHoursRow = impl.deleteHoursRow;
