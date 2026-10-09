/**
 * Link helpers for media + maps. The back office has no file storage: the admin pastes
 * public links to photos/videos (Cloudinary, ImgBB, Google Drive direct links, …).
 */

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Instagram post/reel pages are web pages, not media files — they can't be shown directly. */
export function isInstagramPageUrl(value: string): boolean {
  return /^https?:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\//i.test(value);
}

/** Best guess of the media type from the link (used to pre-select Foto/Video). */
export function guessMediaType(value: string): 'image' | 'video' {
  return VIDEO_EXTENSIONS.test(value) || /\/video\/upload\//.test(value) ? 'video' : 'image';
}

/** Specific problem with a media link, or '' when it looks usable. */
export function getMediaUrlProblem(value: string): string {
  if (value === '') return '';
  if (!isHttpUrl(value)) return 'El enlace debe empezar con https://';
  if (isInstagramPageUrl(value)) {
    return 'Ese es el enlace de una publicación de Instagram, no de la foto o video. Sube el archivo a Cloudinary o similar y pega ese enlace.';
  }
  return '';
}

export type MapCoordinates = { latitude: number; longitude: number };

/**
 * Reads coordinates from a Google Maps link. Prefers the exact pin (!3d…!4d…) over the
 * map view center (@lat,lng). Returns null when the link has no coordinates.
 */
export function parseMapsCoordinates(mapsUrl: string): MapCoordinates | null {
  const pin = /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/.exec(mapsUrl);
  const view = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(mapsUrl);
  const query = /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(mapsUrl);
  const match = pin ?? view ?? query;
  if (!match) return null;
  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  const isInRange = Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
  return isInRange ? { latitude, longitude } : null;
}

/**
 * Short links from the Maps app "Compartir" button (maps.app.goo.gl/…, goo.gl/maps/…) carry
 * no coordinates — the server follows their redirect to the full link (see saveLocation).
 */
export function isGoogleMapsShortLink(value: string): boolean {
  return /^https:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//i.test(value.trim());
}

/** Embeddable map for previews (no API key needed). */
export function buildMapEmbedUrl({ latitude, longitude }: MapCoordinates): string {
  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=17&hl=es&output=embed`;
}
