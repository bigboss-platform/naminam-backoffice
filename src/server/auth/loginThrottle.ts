import 'server-only';
import * as demo from '../demo/loginThrottle.demo';
import { IS_DEMO_MODE } from '../demo/demoMode';
import * as mongo from './loginThrottle.mongo';

/** Login lockout in MongoDB, or in memory in DEMO MODE (server/demo/demoMode.ts). */
const impl: typeof mongo = IS_DEMO_MODE ? demo : mongo;

export const getLockSecondsLeft = impl.getLockSecondsLeft;
export const recordFailedLogin = impl.recordFailedLogin;
export const clearFailedLogins = impl.clearFailedLogins;
