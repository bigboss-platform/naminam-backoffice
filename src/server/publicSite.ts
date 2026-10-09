import 'server-only';

/**
 * Tells the public site (landing-app POST /api/revalidate) to refresh right away after a
 * save. Optional: without LANDING_REVALIDATE_URL the site still updates within 60s on its
 * own. Never blocks or fails a save — errors are only logged.
 */
export async function refreshPublicSite(): Promise<void> {
  const url = process.env.LANDING_REVALIDATE_URL;
  const secret = process.env.LANDING_REVALIDATE_SECRET;
  if (!url || !secret) return;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) console.error(`[publicSite] refresh respondió ${response.status}`);
  } catch (error) {
    console.error('[publicSite] no se pudo avisar a la web pública:', error);
  }
}
