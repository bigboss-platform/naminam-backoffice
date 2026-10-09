import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

process.env.SESSION_SECRET = 'test-secret-that-is-long-enough-for-hs256-signing';

const { hashPassword, verifyPassword } = await import('@/server/auth/password');
const { decryptSession, encryptSession } = await import('@/server/auth/session');

describe('password hashing (scrypt)', () => {
  it('verifies the right password and rejects a wrong one', async () => {
    const stored = await hashPassword('dulce2026');
    assert.match(stored, /^scrypt\$/);
    assert.ok(await verifyPassword('dulce2026', stored));
    assert.ok(!(await verifyPassword('dulce2027', stored)));
  });
  it('rejects malformed hashes', async () => {
    assert.ok(!(await verifyPassword('x', 'plain-text')));
  });
});

describe('session token (jose HS256)', () => {
  it('round-trips the payload', async () => {
    const token = await encryptSession({ adminId: 'abc', email: 'a@b.com', name: 'Ñami' });
    assert.deepEqual(await decryptSession(token), { adminId: 'abc', email: 'a@b.com', name: 'Ñami' });
  });
  it('rejects tampered or empty tokens', async () => {
    const token = await encryptSession({ adminId: 'abc', email: 'a@b.com', name: 'Ñami' });
    assert.equal(await decryptSession(`${token.slice(0, -2)}xx`), null);
    assert.equal(await decryptSession(''), null);
  });
});
