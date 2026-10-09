'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { MediaType } from '../types/Product.type';
import styles from './ProductMedia.module.css';

type ProductMediaProps = {
  mediaType: MediaType;
  mediaUrl: string;
  posterUrl: string;
  alt: string;
  /** Preview: video plays (muted, looping). List thumbnails: still frame. */
  isLive: boolean;
  sizes: string;
};

/**
 * Shows a pasted photo/video link exactly as given (no media server). Links can point to
 * any host, so images are `unoptimized` (no next/image domain allow-list needed). A broken
 * link shows a clear placeholder instead of a broken-image icon.
 */
export function ProductMedia({ mediaType, mediaUrl, posterUrl, alt, isLive, sizes }: ProductMediaProps) {
  const [failedUrl, setFailedUrl] = useState('');
  const hasFailed = failedUrl !== '' && failedUrl === mediaUrl;

  if (mediaUrl === '' || hasFailed) {
    return (
      <div className={styles.placeholder} role="img" aria-label={alt}>
        <span className="material-symbols-outlined">{hasFailed ? 'warning' : 'image'}</span>
        {hasFailed && <span className={styles.placeholderText}>No pudimos cargar este enlace</span>}
      </div>
    );
  }

  if (mediaType === 'video') {
    return (
      <div className={styles.frame}>
        <video
          key={mediaUrl}
          className={styles.media}
          src={mediaUrl}
          poster={posterUrl || undefined}
          muted
          playsInline
          loop={isLive}
          autoPlay={isLive}
          preload="metadata"
          onError={() => setFailedUrl(mediaUrl)}
        />
        {!isLive && (
          <span className={styles.videoBadge} aria-hidden="true">
            <span className="material-symbols-outlined">play_circle</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={styles.frame}>
      <Image
        src={mediaUrl}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized
        className={styles.media}
        onError={() => setFailedUrl(mediaUrl)}
      />
    </div>
  );
}
