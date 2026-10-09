/**
 * Lets `node --test` run the app's TypeScript sources directly (Node 22 strips types):
 * maps the "@/…" alias to src/ and adds the missing ".ts"/".tsx" extension to imports.
 * Registered by tests/register.mjs. Test-only — the app itself is built by Next.
 */
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SRC_URL = new URL('../src/', import.meta.url);
const EXTENSIONS = ['.ts', '.tsx', '/index.ts'];

function withExtension(url) {
  const path = fileURLToPath(url);
  if (existsSync(path) && !path.endsWith('/')) return url;
  for (const extension of EXTENSIONS) {
    if (existsSync(path + extension)) return pathToFileURL(path + extension).href;
  }
  return url;
}

export async function resolve(specifier, context, nextResolve) {
  // "next/headers" etc. have no package "exports" map — plain Node ESM needs the ".js".
  if (/^next\/[a-z-]+$/.test(specifier)) return nextResolve(`${specifier}.js`, context);
  if (specifier.startsWith('@/')) {
    return nextResolve(withExtension(new URL(specifier.slice(2), SRC_URL).href), context);
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.includes('/src/')) {
    return nextResolve(withExtension(new URL(specifier, context.parentURL).href), context);
  }
  return nextResolve(specifier, context);
}
