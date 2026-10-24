import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  extractEmailFromPaste,
  extractPasswordFromPaste,
  formatCountdown,
  getEmailSuggestions,
  isEmailFormatValid,
  sanitizeEmailInput,
  shouldAutoCheckEmail,
} from '@/features/auth/utils/email.util';

const labels = (value: string) => getEmailSuggestions(value).map((suggestion) => suggestion.label);

describe('email suggestions', () => {
  it('offers "@" only after 5 characters', () => {
    assert.deepEqual(labels('ana'), []);
    assert.deepEqual(labels('anita'), ['@']);
    assert.equal(getEmailSuggestions('anita')[0].value, 'anita@');
  });
  it('filters common domains by what follows "@"', () => {
    assert.deepEqual(labels('ana@ho'), ['@hotmail.com']);
    assert.equal(getEmailSuggestions('ana@ho')[0].value, 'ana@hotmail.com');
    assert.deepEqual(labels('ana@gmail.com'), []);
  });
  it('suggests endings for other domains', () => {
    assert.deepEqual(labels('ana@naminam'), ['.com', '.com.ve', '.net']);
    assert.equal(getEmailSuggestions('ana@naminam.c')[0].value, 'ana@naminam.com');
    assert.deepEqual(labels('ana@.'), []);
  });
});

describe('email input', () => {
  it('removes spaces, lowercases and keeps one "@"', () => {
    assert.equal(sanitizeEmailInput(' Ana @Gmail.com@ '), 'ana@gmail.com');
  });
  it('validates format', () => {
    assert.ok(isEmailFormatValid('ana@gmail.com'));
    assert.ok(isEmailFormatValid('ana@naminam.com.ve'));
    assert.ok(!isEmailFormatValid('ana@gmail'));
    assert.ok(!isEmailFormatValid('ana@gmail.c'));
  });
  it('waits for half-typed common domains before checking', () => {
    assert.ok(!shouldAutoCheckEmail('ana@gmail.co'));
    assert.ok(shouldAutoCheckEmail('ana@gmail.com'));
    assert.ok(shouldAutoCheckEmail('ana@naminam.co'));
  });
});

describe('smart paste', () => {
  it('finds the email inside any text', () => {
    assert.equal(extractEmailFromPaste('Correo: Test@Gmail.com ✓'), 'test@gmail.com');
    assert.equal(extractEmailFromPaste('  test@gmail.com\n'), 'test@gmail.com');
  });
  it('cleans the password', () => {
    assert.equal(extractPasswordFromPaste('  Hola1234!  \n'), 'Hola1234!');
    assert.equal(extractPasswordFromPaste('Contraseña: Hola1234!'), 'Hola1234!');
    assert.equal(extractPasswordFromPaste('ADMIN_EMAIL=a@b.com\nADMIN_PASSWORD=Hola1234!'), 'Hola1234!');
  });
});

describe('lock countdown', () => {
  it('formats m:ss', () => {
    assert.equal(formatCountdown(600), '10:00');
    assert.equal(formatCountdown(59), '0:59');
  });
});
