import Image from 'next/image';

/** Santanita's circular mascot logo (no text) — same asset as the public site: public/brand/logo.webp. */
export function BrandLogo({ height, priority = false }: { height: number; priority?: boolean }) {
  return (
    <Image
      src="/brand/logo.webp"
      alt="Los Antojitos de Santanita"
      width={height}
      height={height}
      priority={priority}
      style={{ display: 'block', borderRadius: '50%' }}
    />
  );
}
