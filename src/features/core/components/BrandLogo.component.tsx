import Image from 'next/image';

/** Client's real logo (same asset as the landing: public/brand/logo.png). */
const LOGO_ASPECT_RATIO = 770 / 522;

export function BrandLogo({ height, priority = false }: { height: number; priority?: boolean }) {
  return (
    <Image
      src="/brand/logo.png"
      alt="Ñami Ñam"
      width={Math.round(height * LOGO_ASPECT_RATIO)}
      height={height}
      priority={priority}
      style={{ display: 'block' }}
    />
  );
}
