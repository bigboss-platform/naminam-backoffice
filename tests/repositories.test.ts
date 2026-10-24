/**
 * Integration tests against the local Docker MongoDB (docker compose up -d), on a separate
 * throwaway database so real data is never touched.
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { MongoClient } from 'mongodb';
import { EMPTY_PRODUCT_INPUT } from '@/features/products/types/Product.type';

const TEST_DB = 'santanita_test';
process.env.MONGODB_URI ??= 'mongodb://santanita:santanita-dev@localhost:27018/?authSource=admin';
process.env.MONGODB_DB = TEST_DB;

const categories = await import('@/server/repositories/categories.repository');
const products = await import('@/server/repositories/products.repository');
const settings = await import('@/server/repositories/settings.repository');
const throttle = await import('@/server/auth/loginThrottle');

async function dropTestDb() {
  const client = await new MongoClient(process.env.MONGODB_URI as string).connect();
  await client.db(TEST_DB).dropDatabase();
  await client.close();
}

before(dropTestDb);
after(async () => {
  await dropTestDb();
  const globalForMongo = globalThis as typeof globalThis & { naminamMongoClient?: Promise<MongoClient> };
  await (await globalForMongo.naminamMongoClient)?.close();
});

describe('categories repository', () => {
  it('creates with unique slugs, reorders and deletes', async () => {
    const first = await categories.createCategory({ label: 'Postre', tagline: '' });
    const duplicate = await categories.createCategory({ label: 'Postre', tagline: 'Otra' });
    assert.equal(first.slug, 'postre');
    assert.equal(duplicate.slug, 'postre-2');

    await categories.moveCategory(duplicate.id, -1);
    assert.deepEqual((await categories.listCategories()).map((category) => category.id), [duplicate.id, first.id]);

    assert.ok(await categories.deleteCategory(duplicate.id));
    assert.equal((await categories.listCategories()).length, 1);
  });
});

describe('products repository', () => {
  it('creates, keeps the slug on rename, toggles flags and deletes', async () => {
    const input = { ...EMPTY_PRODUCT_INPUT, name: 'Cheesecake de Fresa', categoryId: 'postre', price: 6, description: 'Cremoso.' };
    const created = await products.createProduct(input);
    assert.equal(created.slug, 'cheesecake-de-fresa');
    assert.equal(await products.countProductsInCategory('postre'), 1);

    assert.ok(await products.updateProduct(created.id, { ...input, name: 'Cheesecake de Fresas', price: 6.5 }));
    assert.ok(await products.setProductFlag(created.id, 'isAvailable', false));
    const [updated] = await products.listProducts();
    assert.equal(updated.slug, 'cheesecake-de-fresa');
    assert.equal(updated.name, 'Cheesecake de Fresas');
    assert.equal(updated.price, 6.5);
    assert.equal(updated.isAvailable, false);

    assert.ok(await products.deleteProduct(created.id));
    assert.equal((await products.listProducts()).length, 0);
  });
});

describe('settings repository', () => {
  it('upserts partial sections and edits hours rows', async () => {
    assert.equal((await settings.getBusinessSettings()).name, 'Los Antojitos de Santanita');
    await settings.updateBusinessSettings({ whatsappNumber: '51987654321', city: 'Lima' });
    await settings.addHoursRow({ label: 'Martes a viernes', opensAt: '10:00', closesAt: '20:00' });

    const saved = await settings.getBusinessSettings();
    assert.equal(saved.whatsappNumber, '51987654321');
    assert.equal(saved.hours.length, 1);

    const rowId = saved.hours[0].id;
    assert.ok(await settings.updateHoursRow(rowId, { label: 'Martes a viernes', opensAt: '09:00', closesAt: '20:00' }));
    assert.equal((await settings.getBusinessSettings()).hours[0].opensAt, '09:00');

    await settings.deleteHoursRow(rowId);
    assert.equal((await settings.getBusinessSettings()).hours.length, 0);
  });
});

describe('login lockout (MongoDB)', () => {
  it('counts down attempts, locks on the 5th and clears on success', async () => {
    const email = 'lock@test.com';
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      assert.deepEqual(await throttle.recordFailedLogin(email), { attemptsLeft: 5 - attempt, lockSecondsLeft: 0 });
    }
    assert.deepEqual(await throttle.recordFailedLogin(email), { attemptsLeft: 0, lockSecondsLeft: 600 });
    const secondsLeft = await throttle.getLockSecondsLeft(email);
    assert.ok(secondsLeft > 590 && secondsLeft <= 600);
    await throttle.clearFailedLogins(email);
    assert.equal(await throttle.getLockSecondsLeft(email), 0);
  });
});
