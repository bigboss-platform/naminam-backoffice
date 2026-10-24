/**
 * Placeholder of Img_Logo_Main (circular, sunset background) — same badge as the public
 * site (naminam-menu BrandLogo). Swap for the real logo image when the client sends it.
 */
export function BrandLogo({ height }: { height: number; priority?: boolean }) {
  return (
    <span
      role="img"
      aria-label="Los Antojitos de Santanita"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: height,
        height,
        flexShrink: 0,
        borderRadius: '50%',
        border: '3px solid var(--c-cacao)',
        background:
          'radial-gradient(circle at 50% 78%, var(--c-arena) 0 24%, transparent 25%), linear-gradient(180deg, var(--c-manjar) 0%, var(--c-guayaba) 100%)',
        color: 'var(--c-cacao)',
        fontFamily: 'var(--font-display), cursive',
        fontWeight: 800,
        fontSize: height * 0.5,
        lineHeight: 1,
      }}
    >
      S
    </span>
  );
}
