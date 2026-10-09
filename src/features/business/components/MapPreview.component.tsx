import { buildMapEmbedUrl, type MapCoordinates } from '@/features/core/utils/links.util';
import styles from './MapPreview.module.css';

/** Same embedded map the public site's footer shows. */
export function MapPreview({ coordinates, title }: { coordinates: MapCoordinates; title: string }) {
  return (
    <iframe
      className={styles.map}
      src={buildMapEmbedUrl(coordinates)}
      title={`Mapa: ${title}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
