import { useState } from 'react';
import { motion } from 'framer-motion';
import { IMAGE_WIDTHS, imageUrl } from '../data/images';

/**
 * Responsive, lazy-loaded image.
 *  - Builds a srcset from the central image registry so phones get small files.
 *  - Fades in once decoded (no pop-in).
 *  - Falls back to a branded tonal panel if the file fails to load.
 *
 * `image` is an entry from data/images.js ({ src, alt }).
 * `priority` = eager + high fetch priority (use for the first visible image only).
 */
export default function Img({ image, alt, sizes = '100vw', priority = false, className = '', style, width = 1600, height = 1067 }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const src = image?.src;
  const altText = alt ?? image?.alt ?? '';

  if (!src || failed) {
    return (
      <div role="img" aria-label={altText} className={`img-fallback h-full w-full ${className}`}>
        <span className="font-display text-2xl tracking-[0.3em] opacity-60">LUMORA</span>
      </div>
    );
  }

  const isRemote = typeof src !== 'string';
  const srcSet = isRemote ? IMAGE_WIDTHS.map((w) => `${imageUrl(src, w)} ${w}w`).join(', ') : undefined;

  return (
    <motion.img
      src={imageUrl(src, 1600)}
      srcSet={srcSet}
      sizes={isRemote ? sizes : undefined}
      alt={altText}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      draggable={false}
      style={style}
      className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  );
}
