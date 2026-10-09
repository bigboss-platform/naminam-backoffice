import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isStrongPassword } from '@/features/account/utils/password.rules';
import { getContactProblems, getHoursRowProblems, getLocationProblems } from '@/features/business/utils/business.validation';
import { EMPTY_PRODUCT_INPUT } from '@/features/products/types/Product.type';
import { getProductProblems, normalizeProductInput } from '@/features/products/utils/product.validation';

const CATEGORY_IDS = ['racion', 'cheesecake'];
const VALID_PRODUCT = {
  ...EMPTY_PRODUCT_INPUT,
  name: 'Matilda',
  categoryId: 'racion',
  price: 7,
  description: 'Bizcocho de chocolate.',
};

describe('product validation', () => {
  it('accepts a complete product', () => {
    assert.deepEqual(getProductProblems(VALID_PRODUCT, CATEGORY_IDS), {});
  });
  it('lists every missing required field', () => {
    const problems = getProductProblems(EMPTY_PRODUCT_INPUT, CATEGORY_IDS);
    assert.deepEqual(Object.keys(problems).sort(), ['categoryId', 'description', 'name', 'price']);
  });
  it('rejects unknown categories and Instagram post links', () => {
    const problems = getProductProblems(
      { ...VALID_PRODUCT, categoryId: 'nope', mediaUrl: 'https://instagram.com/p/xyz/' },
      CATEGORY_IDS,
    );
    assert.ok(problems.categoryId);
    assert.ok(problems.mediaUrl);
  });
  it('drops the poster for photos and trims text', () => {
    const clean = normalizeProductInput({ ...VALID_PRODUCT, name: '  Matilda ', mediaType: 'image', posterUrl: 'https://x.com/p.jpg' });
    assert.equal(clean.name, 'Matilda');
    assert.equal(clean.posterUrl, '');
  });
});

describe('business validation', () => {
  it('requires a WhatsApp number with country code', () => {
    assert.ok(getContactProblems({ whatsappNumber: '4126722218', phoneNumber: '', instagramHandle: '' }).whatsappNumber === undefined);
    assert.ok(getContactProblems({ whatsappNumber: '412', phoneNumber: '', instagramHandle: '' }).whatsappNumber);
    assert.ok(getContactProblems({ whatsappNumber: '584126722218', phoneNumber: '', instagramHandle: 'bad handle' }).instagramHandle);
  });
  it('validates hours rows', () => {
    assert.deepEqual(getHoursRowProblems({ label: 'Martes a viernes', opensAt: '10:00', closesAt: '20:00' }), {});
    assert.ok(getHoursRowProblems({ label: '', opensAt: '25:00', closesAt: '20' }).opensAt);
  });
  it('requires a Maps link with coordinates — or a "Compartir" short link the server resolves', () => {
    assert.ok(getLocationProblems({ address: 'X', city: 'Y', mapsUrl: 'https://www.google.com/maps/search/panaderia' }).mapsUrl);
    assert.deepEqual(getLocationProblems({ address: 'X', city: 'Y', mapsUrl: 'https://maps.app.goo.gl/abc123' }), {});
    assert.deepEqual(getLocationProblems({ address: 'X', city: 'Y', mapsUrl: '' }), {});
  });
});

describe('password rules', () => {
  it('needs 8+ chars with a letter and a number', () => {
    assert.ok(isStrongPassword('dulce2026'));
    assert.ok(!isStrongPassword('dulce'));
    assert.ok(!isStrongPassword('12345678'));
  });
});
