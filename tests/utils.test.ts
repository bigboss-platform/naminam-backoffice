import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  amountToCentsDigits,
  centsDigitsToAmount,
  formatHour,
  formatMenuPrice,
  formatMoneyInput,
  formatPhone,
  isValidTime,
  slugify,
  timeDigitsToText,
} from '@/features/core/utils/format.util';
import { getMediaUrlProblem, guessMediaType, isGoogleMapsShortLink, parseMapsCoordinates } from '@/features/core/utils/links.util';

describe('money (keypad digits = cents)', () => {
  it('converts keypad digits to an amount and back', () => {
    assert.equal(centsDigitsToAmount('650'), 6.5);
    assert.equal(centsDigitsToAmount(''), 0);
    assert.equal(amountToCentsDigits(7.2), '720');
    assert.equal(amountToCentsDigits(0), '');
  });
  it('formats with workspace money format and menu format', () => {
    assert.equal(formatMoneyInput(1234.5), '1.234,50');
    assert.equal(formatMoneyInput(6), '6,00');
    assert.equal(formatMenuPrice(7), '$7');
    assert.equal(formatMenuPrice(6.5), '$6.50');
  });
});

describe('time', () => {
  it('builds HH:MM from keypad digits', () => {
    assert.equal(timeDigitsToText('19'), '19');
    assert.equal(timeDigitsToText('1930'), '19:30');
  });
  it('validates real hours only', () => {
    assert.ok(isValidTime('00:00'));
    assert.ok(isValidTime('23:59'));
    assert.ok(!isValidTime('24:00'));
    assert.ok(!isValidTime('19:60'));
    assert.ok(!isValidTime('930'));
  });
  it('formats 12h for display', () => {
    assert.equal(formatHour('19:30'), '7:30 p. m.');
    assert.equal(formatHour('00:15'), '12:15 a. m.');
    assert.equal(formatHour('12:00'), '12:00 p. m.');
  });
});

describe('phone + slug', () => {
  it('formats Venezuelan numbers', () => {
    assert.equal(formatPhone('584126722218'), '+58 412 672 2218');
    assert.equal(formatPhone(''), '');
  });
  it('slugifies Spanish names', () => {
    assert.equal(slugify('Cheesecake de Pistacho'), 'cheesecake-de-pistacho');
    assert.equal(slugify('Torta Bombón'), 'torta-bombon');
    assert.equal(slugify('  Ñami  Ñam! '), 'nami-nam');
  });
});

describe('links', () => {
  it("reads the pin from the client's Google Maps link", () => {
    const url =
      'https://www.google.com/maps/place/%C3%91ami+%C3%91am/@10.0614949,-69.2922501,17z/data=!4m6!3m5!1s0x8e8767897c419a35:0x371864a27e37a448!8m2!3d10.0614949!4d-69.2922501';
    assert.deepEqual(parseMapsCoordinates(url), { latitude: 10.0614949, longitude: -69.2922501 });
  });
  it('rejects links without coordinates and recognizes "Compartir" short links', () => {
    assert.equal(parseMapsCoordinates('https://maps.app.goo.gl/abc'), null);
    assert.ok(isGoogleMapsShortLink('https://maps.app.goo.gl/abc'));
    assert.ok(isGoogleMapsShortLink('https://goo.gl/maps/xyz'));
    assert.ok(!isGoogleMapsShortLink('https://evil.example/maps.app.goo.gl/abc'));
  });
  it('explains Instagram post links and non-https links', () => {
    assert.match(getMediaUrlProblem('https://www.instagram.com/p/ABC123/'), /Instagram/);
    assert.match(getMediaUrlProblem('ftp://x.com/a.jpg'), /https/);
    assert.equal(getMediaUrlProblem('https://res.cloudinary.com/demo/image/upload/a.jpg'), '');
    assert.equal(getMediaUrlProblem(''), '');
  });
  it('guesses video links', () => {
    assert.equal(guessMediaType('https://x.com/clip.mp4'), 'video');
    assert.equal(guessMediaType('https://res.cloudinary.com/demo/video/upload/v1/clip'), 'video');
    assert.equal(guessMediaType('https://x.com/photo.jpg'), 'image');
  });
});
